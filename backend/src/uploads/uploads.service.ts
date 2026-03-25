import {
  Injectable,
  NestInterceptor,
  NotFoundException,
  OnModuleInit,
  Type,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  EntityManager,
  In,
  LessThanOrEqual,
  Repository,
} from 'typeorm';

import { UploadAsset, UploadAssetStatus } from './entities/upload-asset.entity';

type UploadOptions = {
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
};

type UploadAssetRecord = Pick<
  UploadAsset,
  'id' | 'path' | 'status' | 'expiresAt' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class UploadsService implements OnModuleInit {
  private static readonly TEMP_UPLOAD_TTL_MS = 24 * 60 * 60 * 1000;
  private static readonly PURGE_BATCH_SIZE = 50;
  private static readonly PURGE_INTERVAL_MS = 5 * 60 * 1000;

  private readonly uploadPath: string;
  private readonly defaultAllowedMimeTypes: string[];
  private readonly blockedExtensions: Set<string>;
  private readonly maxFileSizeBytes: number;
  private lastPurgeAt = 0;
  private purgeInFlight: Promise<void> | null = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UploadAsset)
    private readonly uploadAssetRepository: Repository<UploadAsset>,
  ) {
    this.uploadPath = this.configService.getOrThrow<string>('app.upload.path');
    this.defaultAllowedMimeTypes = this.configService.getOrThrow<string[]>(
      'app.upload.allowedMimeTypes',
    );
    this.maxFileSizeBytes = this.configService.getOrThrow<number>(
      'app.upload.maxFileSizeBytes',
    );
    this.blockedExtensions = new Set(
      this.configService
        .getOrThrow<string[]>('app.upload.blockedExtensions')
        .map((ext) => ext.toLowerCase()),
    );
  }

  async onModuleInit() {
    await fs.mkdir(this.uploadPath, { recursive: true });
    await this.purgeExpiredTempUploads(true);
  }

  async cleanup(filePath: string): Promise<void> {
    if (!filePath) {
      return;
    }

    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(this.uploadPath, filePath);

    try {
      await fs.unlink(resolvedPath);
    } catch {
      // Ignore errors if file doesn't exist or cannot be deleted
    }
  }

  async delete(filePath: string): Promise<void> {
    return this.cleanup(filePath);
  }

  async createTempUpload(
    filePath: string,
    ownerUserId: string,
  ): Promise<UploadAssetRecord> {
    await this.purgeExpiredTempUploads();

    const asset = this.uploadAssetRepository.create({
      path: filePath,
      ownerUserId,
      status: UploadAssetStatus.TEMP,
      attachedEntityType: null,
      attachedEntityId: null,
      expiresAt: new Date(Date.now() + UploadsService.TEMP_UPLOAD_TTL_MS),
    });

    return this.toUploadAssetRecord(await this.uploadAssetRepository.save(asset));
  }

  async deleteTempUpload(
    id: string,
    ownerUserId: string,
  ): Promise<{ message: string }> {
    await this.purgeExpiredTempUploads();

    const asset = await this.uploadAssetRepository.findOne({
      where: {
        id,
        ownerUserId,
        status: UploadAssetStatus.TEMP,
      },
    });

    if (!asset) {
      throw new NotFoundException('Temporary upload not found');
    }

    await this.markAssetsDeleted([asset], this.uploadAssetRepository);

    return { message: 'Temporary upload deleted successfully' };
  }

  async attachTempUploadsFromPayload(
    ownerUserId: string,
    payload: unknown,
    attachedEntityType: string,
    attachedEntityId: string,
    manager?: EntityManager,
  ): Promise<void> {
    const candidatePaths = this.collectCandidatePaths(payload);
    await this.attachTempUploadsByPaths(
      ownerUserId,
      candidatePaths,
      attachedEntityType,
      attachedEntityId,
      manager,
    );
  }

  async releaseTempUploadsFromPayload(
    ownerUserId: string,
    payload: unknown,
    manager?: EntityManager,
  ): Promise<void> {
    const candidatePaths = this.collectCandidatePaths(payload);
    await this.releaseTempUploadsByPaths(ownerUserId, candidatePaths, manager);
  }

  async withEntityUploads<T extends { id: string }>(
    ownerUserId: string,
    payload: unknown,
    attachedEntityType: string,
    action: (manager?: EntityManager) => Promise<T>,
    manager?: EntityManager,
  ): Promise<T> {
    try {
      const result = await action(manager);
      await this.attachTempUploadsFromPayload(
        ownerUserId,
        payload,
        attachedEntityType,
        result.id,
        manager,
      );
      return result;
    } catch (error) {
      await this.releaseTempUploadsFromPayload(ownerUserId, payload, manager);
      throw error;
    }
  }

  async purgeExpiredTempUploads(force = false): Promise<void> {
    const now = Date.now();
    if (
      !force &&
      now - this.lastPurgeAt < UploadsService.PURGE_INTERVAL_MS
    ) {
      return this.purgeInFlight ?? Promise.resolve();
    }

    if (this.purgeInFlight) {
      return this.purgeInFlight;
    }

    this.lastPurgeAt = now;
    this.purgeInFlight = this.purgeExpiredTempUploadsInternal().finally(() => {
      this.purgeInFlight = null;
    });
    return this.purgeInFlight;
  }

  uploadSingle(
    fieldName: string,
    options?: UploadOptions,
  ): Type<NestInterceptor> {
    return FileInterceptor(fieldName, this.buildMulterOptions(options));
  }

  uploadMultiple(
    fieldName: string,
    maxCount: number,
    options?: UploadOptions,
  ): Type<NestInterceptor> {
    return FilesInterceptor(
      fieldName,
      maxCount,
      this.buildMulterOptions(options),
    );
  }

  public buildMulterOptions(options?: UploadOptions) {
    const allowedMimeTypes =
      options?.allowedMimeTypes ?? this.defaultAllowedMimeTypes;
    const uploadPath = this.uploadPath;

    return {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const extension = path.extname(file.originalname).toLowerCase();
          const safeName = `${Date.now()}-${randomUUID()}${extension}`;
          cb(null, safeName);
        },
      }),
      limits: {
        fileSize: options?.maxFileSizeBytes ?? this.maxFileSizeBytes,
      },
      fileFilter: (
        _req: unknown,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (this.blockedExtensions.has(extension)) {
          cb(
            new UnsupportedMediaTypeException(
              `File extension ${extension} is not allowed.`,
            ) as unknown as Error,
            false,
          );
          return;
        }

        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(
            new UnsupportedMediaTypeException(
              `MIME type ${file.mimetype} is not allowed.`,
            ) as unknown as Error,
            false,
          );
          return;
        }

        cb(null, true);
      },
    };
  }

  private async attachTempUploadsByPaths(
    ownerUserId: string,
    candidatePaths: string[],
    attachedEntityType: string,
    attachedEntityId: string,
    manager?: EntityManager,
  ): Promise<void> {
    await this.purgeExpiredTempUploads();

    const assets = await this.findTempAssetsByPaths(
      ownerUserId,
      candidatePaths,
      manager,
    );
    if (!assets.length) {
      return;
    }

    for (const asset of assets) {
      asset.status = UploadAssetStatus.ATTACHED;
      asset.attachedEntityType = attachedEntityType;
      asset.attachedEntityId = attachedEntityId;
      asset.expiresAt = null;
    }

    await this.getUploadAssetRepository(manager).save(assets);
  }

  private async releaseTempUploadsByPaths(
    ownerUserId: string,
    candidatePaths: string[],
    manager?: EntityManager,
  ): Promise<void> {
    const assets = await this.findTempAssetsByPaths(
      ownerUserId,
      candidatePaths,
      manager,
    );
    if (!assets.length) {
      return;
    }

    await this.markAssetsDeleted(assets, this.getUploadAssetRepository(manager));
  }

  private async findTempAssetsByPaths(
    ownerUserId: string,
    candidatePaths: string[],
    manager?: EntityManager,
  ): Promise<UploadAsset[]> {
    const uniquePaths = [...new Set(candidatePaths.filter(Boolean))];
    if (!uniquePaths.length) {
      return [];
    }

    return this.getUploadAssetRepository(manager).find({
      where: {
        ownerUserId,
        status: UploadAssetStatus.TEMP,
        path: In(uniquePaths),
      },
    });
  }

  private collectCandidatePaths(payload: unknown): string[] {
    const paths = new Set<string>();

    const visit = (value: unknown) => {
      if (typeof value === 'string') {
        const normalized = value.trim();
        if (normalized.length > 0) {
          paths.add(normalized);
        }
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }

      if (value && typeof value === 'object') {
        Object.values(value as Record<string, unknown>).forEach(visit);
      }
    };

    visit(payload);

    return [...paths];
  }

  private async purgeExpiredTempUploadsInternal(): Promise<void> {
    while (true) {
      const expired = await this.uploadAssetRepository.find({
        where: {
          status: UploadAssetStatus.TEMP,
          expiresAt: LessThanOrEqual(new Date()),
        },
        order: { expiresAt: 'ASC' },
        take: UploadsService.PURGE_BATCH_SIZE,
      });

      if (!expired.length) {
        return;
      }

      await this.markAssetsDeleted(expired, this.uploadAssetRepository);

      if (expired.length < UploadsService.PURGE_BATCH_SIZE) {
        return;
      }
    }
  }

  private async markAssetsDeleted(
    assets: UploadAsset[],
    repository: Repository<UploadAsset>,
  ): Promise<void> {
    for (const asset of assets) {
      await this.cleanup(asset.path);
      asset.status = UploadAssetStatus.DELETED;
      asset.attachedEntityType = null;
      asset.attachedEntityId = null;
      asset.expiresAt = null;
    }

    await repository.save(assets);
  }

  private getUploadAssetRepository(manager?: EntityManager) {
    return manager
      ? manager.getRepository(UploadAsset)
      : this.uploadAssetRepository;
  }

  private toUploadAssetRecord(asset: UploadAsset): UploadAssetRecord {
    return {
      id: asset.id,
      path: asset.path,
      status: asset.status,
      expiresAt: asset.expiresAt,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }
}
