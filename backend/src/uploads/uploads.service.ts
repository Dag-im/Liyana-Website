import { Injectable, NestInterceptor, Type, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

type UploadOptions = {
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
};

@Injectable()
export class UploadsService {
  private readonly uploadPath: string;
  private readonly defaultAllowedMimeTypes: string[];
  private readonly blockedExtensions: Set<string>;
  private readonly maxFileSizeBytes: number;

  constructor(private readonly configService: ConfigService) {
    this.uploadPath = this.configService.getOrThrow<string>('app.upload.path');
    this.defaultAllowedMimeTypes = this.configService.getOrThrow<string[]>(
      'app.upload.allowedMimeTypes',
    );
    this.maxFileSizeBytes = this.configService.getOrThrow<number>('app.upload.maxFileSizeBytes');
    this.blockedExtensions = new Set(
      this.configService.getOrThrow<string[]>('app.upload.blockedExtensions').map((ext) => ext.toLowerCase()),
    );

    mkdirSync(this.uploadPath, { recursive: true });
  }

  uploadSingle(fieldName: string, options?: UploadOptions): Type<NestInterceptor> {
    return FileInterceptor(fieldName, this.buildMulterOptions(options));
  }

  uploadMultiple(
    fieldName: string,
    maxCount: number,
    options?: UploadOptions,
  ): Type<NestInterceptor> {
    return FilesInterceptor(fieldName, maxCount, this.buildMulterOptions(options));
  }

  private buildMulterOptions(options?: UploadOptions) {
    const allowedMimeTypes = options?.allowedMimeTypes ?? this.defaultAllowedMimeTypes;

    return {
      storage: diskStorage({
        destination: this.uploadPath,
        filename: (_req, file, cb) => {
          const extension = path.extname(file.originalname).toLowerCase();
          const safeName = `${Date.now()}-${randomUUID()}${extension}`;
          cb(null, safeName);
        },
      }),
      limits: {
        fileSize: options?.maxFileSizeBytes ?? this.maxFileSizeBytes,
      },
      fileFilter: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
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
}
