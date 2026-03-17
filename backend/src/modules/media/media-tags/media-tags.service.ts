import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaTag } from '../entities/media-tag.entity';
import { MediaFolder } from '../entities/media-folder.entity';
import { CreateMediaTagDto } from './dto/create-media-tag.dto';
import { UpdateMediaTagDto } from './dto/update-media-tag.dto';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { AuditAction } from '../../../common/enums/audit-action.enum';

@Injectable()
export class MediaTagsService {
  constructor(
    @InjectRepository(MediaTag)
    private readonly tagRepo: Repository<MediaTag>,
    @InjectRepository(MediaFolder)
    private readonly folderRepo: Repository<MediaFolder>,
    private readonly auditLog: AuditLogService,
  ) {}

  async findAll(): Promise<MediaTag[]> {
    return this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<MediaTag> {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Media tag with ID ${id} not found`);
    }
    return tag;
  }

  async create(dto: CreateMediaTagDto, performedBy: string): Promise<MediaTag> {
    const slug = this.generateSlug(dto.name);

    await this.checkUniqueness(dto.name, slug);

    const tag = this.tagRepo.create({
      ...dto,
      slug,
    });

    const saved = await this.tagRepo.save(tag);
    this.auditLog.log(AuditAction.MEDIA_TAG_CREATED, performedBy, saved.id, {
      name: saved.name,
    });
    return saved;
  }

  async update(
    id: string,
    dto: UpdateMediaTagDto,
    performedBy: string,
  ): Promise<MediaTag> {
    const tag = await this.findOne(id);

    if (dto.name && dto.name !== tag.name) {
      const slug = this.generateSlug(dto.name);
      await this.checkUniqueness(dto.name, slug, id);
      tag.name = dto.name;
      tag.slug = slug;
    }

    const updated = await this.tagRepo.save(tag);
    this.auditLog.log(AuditAction.MEDIA_TAG_UPDATED, performedBy, updated.id, {
      changes: dto,
    });
    return updated;
  }

  async remove(id: string, performedBy: string): Promise<void> {
    const tag = await this.findOne(id);

    const folderCount = await this.folderRepo.count({ where: { tagId: id } });
    if (folderCount > 0) {
      throw new ConflictException(
        'Cannot delete a tag that has folders assigned to it',
      );
    }

    await this.tagRepo.remove(tag);
    this.auditLog.log(AuditAction.MEDIA_TAG_DELETED, performedBy, id, {
      name: tag.name,
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private async checkUniqueness(
    name: string,
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const query = this.tagRepo
      .createQueryBuilder('tag')
      .where('(tag.name = :name OR tag.slug = :slug)', { name, slug });

    if (excludeId) {
      query.andWhere('tag.id != :excludeId', { excludeId });
    }

    const existing = await query.getOne();
    if (existing) {
      throw new ConflictException(
        `Media tag with name "${name}" or slug "${slug}" already exists`,
      );
    }
  }
}
