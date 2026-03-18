import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';
import { MediaFolder } from '../entities/media-folder.entity';
import { MediaItem, MediaItemType } from '../entities/media-item.entity';
import { MediaTagsService } from '../media-tags/media-tags.service';
import { CreateMediaFolderDto } from './dto/create-media-folder.dto';
import { UpdateMediaFolderDto } from './dto/update-media-folder.dto';
import { QueryMediaFolderDto } from './dto/query-media-folder.dto';
import { UploadsService } from '../../../uploads/uploads.service';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { AuditAction } from '../../../common/enums/audit-action.enum';

@Injectable()
export class MediaFoldersService {
  constructor(
    @InjectRepository(MediaFolder)
    private readonly folderRepo: Repository<MediaFolder>,
    @InjectRepository(MediaItem)
    private readonly itemRepo: Repository<MediaItem>,
    private readonly tagsService: MediaTagsService,
    private readonly uploadsService: UploadsService,
    private readonly auditLog: AuditLogService,
  ) {}

  async findAll(queryDto: QueryMediaFolderDto): Promise<{
    data: MediaFolder[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.folderRepo
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.tag', 'tag')
      .where('folder.deletedAt IS NULL');

    if (queryDto.tagId) {
      query.andWhere('folder.tagId = :tagId', { tagId: queryDto.tagId });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('folder.name LIKE :search', { search }).orWhere(
            'folder.description LIKE :search',
            { search },
          );
        }),
      );
    }

    query
      .orderBy('folder.sortOrder', 'ASC')
      .addOrderBy('folder.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [data, total] = await query.getManyAndCount();

    if (data.length > 0) {
      const folderIds = data.map((f) => f.id);
      const counts = await this.itemRepo
        .createQueryBuilder('item')
        .select('item.folderId', 'folderId')
        .addSelect('COUNT(*)', 'count')
        .addSelect('MAX(item.updatedAt)', 'lastUpdated')
        .where('item.deletedAt IS NULL')
        .andWhere('item.folderId IN (:...folderIds)', { folderIds })
        .groupBy('item.folderId')
        .getRawMany();

      const statsMap = new Map(counts.map((c) => [c.folderId, c]));

      data.forEach((folder) => {
        const stats = statsMap.get(folder.id);
        folder.mediaCount = stats ? parseInt(stats.count) : 0;
        folder.lastUpdated = stats
          ? new Date(stats.lastUpdated)
          : folder.updatedAt;
      });
    }

    return { data, total, page, perPage };
  }

  async findOne(id: string): Promise<MediaFolder> {
    const folder = await this.folderRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['tag', 'items'],
    });

    if (!folder) {
      throw new NotFoundException(`Media folder with ID ${id} not found`);
    }

    // Filter out deleted items and sort
    folder.items = (folder.items || [])
      .filter((item) => !item.deletedAt)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    folder.mediaCount = folder.items.length;
    folder.lastUpdated =
      folder.items.length > 0
        ? new Date(Math.max(...folder.items.map((i) => i.updatedAt.getTime())))
        : folder.updatedAt;

    return folder;
  }

  async create(
    dto: CreateMediaFolderDto,
    performedBy: string,
  ): Promise<MediaFolder> {
    await this.tagsService.findOne(dto.tagId);

    const folder = this.folderRepo.create(dto);
    const saved = await this.folderRepo.save(folder);

    this.auditLog.log(AuditAction.MEDIA_FOLDER_CREATED, performedBy, saved.id, {
      name: saved.name,
    });
    return saved;
  }

  async update(
    id: string,
    dto: UpdateMediaFolderDto,
    performedBy: string,
  ): Promise<MediaFolder> {
    const folder = await this.findOne(id);

    if (dto.tagId) {
      await this.tagsService.findOne(dto.tagId);
    }

    if (dto.coverImage && dto.coverImage !== folder.coverImage) {
      await this.uploadsService.delete(folder.coverImage);
    }

    Object.assign(folder, dto);
    const updated = await this.folderRepo.save(folder);

    this.auditLog.log(
      AuditAction.MEDIA_FOLDER_UPDATED,
      performedBy,
      updated.id,
      {
        changes: dto,
      },
    );
    return updated;
  }

  async remove(id: string, performedBy: string): Promise<void> {
    const folder = await this.folderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!folder) {
      throw new NotFoundException(`Media folder with ID ${id} not found`);
    }

    // Cleanup cover image
    await this.uploadsService.delete(folder.coverImage);

    // Cleanup item files
    for (const item of folder.items) {
      if (item.type === MediaItemType.IMAGE) {
        await this.uploadsService.delete(item.url);
      }
      if (item.thumbnail) {
        await this.uploadsService.delete(item.thumbnail);
      }
    }

    await this.folderRepo.softRemove(folder);
    this.auditLog.log(AuditAction.MEDIA_FOLDER_DELETED, performedBy, id, {
      name: folder.name,
    });
  }
}
