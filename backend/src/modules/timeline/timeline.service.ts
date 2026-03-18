import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UploadsService } from '../../uploads/uploads.service';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { QueryTimelineItemDto } from './dto/query-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';
import { TimelineItem } from './entity/timeline-item.entity';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(TimelineItem)
    private readonly timelineRepository: Repository<TimelineItem>,
    private readonly uploadsService: UploadsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createDto: CreateTimelineItemDto, performedBy: string) {
    const item = this.timelineRepository.create(createDto);
    const savedItem = await this.timelineRepository.save(item);

    this.auditLogService.log(
      AuditAction.TIMELINE_ITEM_CREATED,
      performedBy,
      savedItem.id,
      { title: savedItem.title },
    );

    return savedItem;
  }

  async findAll(queryDto: QueryTimelineItemDto) {
    const {
      page = 1,
      perPage = 10,
      search,
      category,
      year,
      sortBy = 'year',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.timelineRepository.createQueryBuilder('item');

    if (search) {
      query.andWhere(
        '(item.title LIKE :search OR item.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      query.andWhere('item.category = :category', { category });
    }

    if (year) {
      query.andWhere('item.year = :year', { year });
    }

    query
      .orderBy(`item.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .addOrderBy('item.sortOrder', 'ASC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: string) {
    const item = await this.timelineRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Timeline item with ID ${id} not found`);
    }
    return item;
  }

  async update(
    id: string,
    updateDto: UpdateTimelineItemDto,
    performedBy: string,
  ) {
    const item = await this.findOne(id);

    if (updateDto.image && updateDto.image !== item.image && item.image) {
      await this.uploadsService.delete(item.image);
    }

    Object.assign(item, updateDto);
    const updatedItem = await this.timelineRepository.save(item);

    this.auditLogService.log(
      AuditAction.TIMELINE_ITEM_UPDATED,
      performedBy,
      updatedItem.id,
      { title: updatedItem.title },
    );

    return updatedItem;
  }

  async remove(id: string, performedBy: string) {
    const item = await this.findOne(id);

    if (item.image) {
      await this.uploadsService.delete(item.image);
    }

    await this.timelineRepository.softRemove(item);

    this.auditLogService.log(
      AuditAction.TIMELINE_ITEM_DELETED,
      performedBy,
      id,
      { title: item.title },
    );

    return { message: 'Timeline item deleted successfully' };
  }
}
