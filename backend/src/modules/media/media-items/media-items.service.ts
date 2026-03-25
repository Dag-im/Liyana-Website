import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { MediaItem, MediaItemType } from '../entities/media-item.entity';
import { MediaFoldersService } from '../media-folders/media-folders.service';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { QueryMediaItemDto } from './dto/query-media-item.dto';
import { UploadsService } from '../../../uploads/uploads.service';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { AuditAction } from '../../../common/enums/audit-action.enum';

@Injectable()
export class MediaItemsService {
  constructor(
    @InjectRepository(MediaItem)
    private readonly itemRepo: Repository<MediaItem>,
    @Inject(forwardRef(() => MediaFoldersService))
    private readonly foldersService: MediaFoldersService,
    private readonly uploadsService: UploadsService,
    private readonly auditLog: AuditLogService,
  ) {}

  async findAll(
    folderId: string,
    queryDto: QueryMediaItemDto,
  ): Promise<{
    data: MediaItem[];
    total: number;
    page: number;
    perPage: number;
  }> {
    await this.foldersService.findOne(folderId);

    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.itemRepo
      .createQueryBuilder('item')
      .where('item.folderId = :folderId', { folderId })
      .andWhere('item.deletedAt IS NULL');

    if (queryDto.type) {
      query.andWhere('item.type = :type', { type: queryDto.type });
    }

    if (queryDto.search) {
      query.andWhere('item.title LIKE :search', {
        search: `%${queryDto.search}%`,
      });
    }

    query
      .orderBy('item.sortOrder', 'ASC')
      .addOrderBy('item.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, perPage };
  }

  async findOne(folderId: string, id: string): Promise<MediaItem> {
    const item = await this.itemRepo.findOne({
      where: { id, folderId, deletedAt: IsNull() },
    });

    if (!item) {
      throw new NotFoundException(
        `Media item with ID ${id} not found in this folder`,
      );
    }

    return item;
  }

  async create(
    folderId: string,
    dto: CreateMediaItemDto,
    performedBy: string,
  ): Promise<MediaItem> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'media-item',
      async () => {
        await this.foldersService.findOne(folderId);

        const type = this.detectMediaType(dto.url);
        if (type === MediaItemType.VIDEO && !this.isYouTubeUrl(dto.url)) {
          throw new BadRequestException('Invalid YouTube URL');
        }

        const item = this.itemRepo.create({
          ...dto,
          folderId,
          type,
        });

        const saved = await this.itemRepo.save(item);
        this.auditLog.log(AuditAction.MEDIA_ITEM_CREATED, performedBy, saved.id, {
          title: saved.title,
          folderId,
        });
        return saved;
      },
    );
  }

  async update(
    folderId: string,
    id: string,
    dto: UpdateMediaItemDto,
    performedBy: string,
  ): Promise<MediaItem> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'media-item',
      async () => {
        const item = await this.findOne(folderId, id);
        const previousUrl =
          dto.url && dto.url !== item.url && item.type === MediaItemType.IMAGE
            ? item.url
            : null;
        const previousThumbnail =
          dto.thumbnail && dto.thumbnail !== item.thumbnail && item.thumbnail
            ? item.thumbnail
            : null;

        if (dto.url && dto.url !== item.url) {
          item.url = dto.url;
          item.type = this.detectMediaType(dto.url);
        }

        Object.assign(item, dto);
        const updated = await this.itemRepo.save(item);

        if (previousUrl) {
          await this.uploadsService.delete(previousUrl);
        }
        if (previousThumbnail) {
          await this.uploadsService.delete(previousThumbnail);
        }

        this.auditLog.log(AuditAction.MEDIA_ITEM_UPDATED, performedBy, updated.id, {
          changes: dto,
        });
        return updated;
      },
    );
  }

  async remove(
    folderId: string,
    id: string,
    performedBy: string,
  ): Promise<void> {
    const item = await this.findOne(folderId, id);

    if (item.type === MediaItemType.IMAGE) {
      await this.uploadsService.delete(item.url);
    }
    if (item.thumbnail) {
      await this.uploadsService.delete(item.thumbnail);
    }

    await this.itemRepo.softRemove(item);
    this.auditLog.log(AuditAction.MEDIA_ITEM_DELETED, performedBy, id, {
      title: item.title,
    });
  }

  private isYouTubeUrl(url: string): boolean {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
  }

  private detectMediaType(url: string): MediaItemType {
    if (this.isYouTubeUrl(url)) return MediaItemType.VIDEO;
    return MediaItemType.IMAGE;
  }
}
