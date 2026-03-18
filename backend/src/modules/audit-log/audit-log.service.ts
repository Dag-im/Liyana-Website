import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { AuditLog } from './entity/audit-log.entity';

const ACTION_ENTITY_TYPE: Record<AuditAction, string> = {
  [AuditAction.USER_CREATED]: 'user',
  [AuditAction.USER_UPDATED]: 'user',
  [AuditAction.USER_DEACTIVATED]: 'user',
  [AuditAction.PASSWORD_CHANGED_BY_ADMIN]: 'user',
  [AuditAction.USER_LOGIN]: 'user',
  [AuditAction.USER_LOGOUT]: 'user',
  [AuditAction.NOTIFICATION_CREATED]: 'notification',
  [AuditAction.SERVICE_CATEGORY_CREATED]: 'service_category',
  [AuditAction.SERVICE_CATEGORY_UPDATED]: 'service_category',
  [AuditAction.SERVICE_CATEGORY_DELETED]: 'service_category',
  [AuditAction.DIVISION_CATEGORY_CREATED]: 'division_category',
  [AuditAction.DIVISION_CATEGORY_UPDATED]: 'division_category',
  [AuditAction.DIVISION_CATEGORY_DELETED]: 'division_category',
  [AuditAction.DIVISION_CREATED]: 'division',
  [AuditAction.DIVISION_UPDATED]: 'division',
  [AuditAction.DIVISION_DELETED]: 'division',

  [AuditAction.NEWS_EVENT_CREATED]: 'news_event',
  [AuditAction.NEWS_EVENT_UPDATED]: 'news_event',
  [AuditAction.NEWS_EVENT_PUBLISHED]: 'news_event',
  [AuditAction.NEWS_EVENT_UNPUBLISHED]: 'news_event',
  [AuditAction.NEWS_EVENT_DELETED]: 'news_event',

  [AuditAction.BLOG_CATEGORY_CREATED]: 'blog_category',
  [AuditAction.BLOG_CATEGORY_UPDATED]: 'blog_category',
  [AuditAction.BLOG_CATEGORY_DELETED]: 'blog_category',
  [AuditAction.BLOG_CREATED]: 'blog',
  [AuditAction.BLOG_UPDATED]: 'blog',
  [AuditAction.BLOG_SUBMITTED]: 'blog',
  [AuditAction.BLOG_PUBLISHED]: 'blog',
  [AuditAction.BLOG_REJECTED]: 'blog',
  [AuditAction.BLOG_FEATURED]: 'blog',
  [AuditAction.BLOG_UNFEATURED]: 'blog',
  [AuditAction.BLOG_DELETED]: 'blog',

  // Bookings
  [AuditAction.BOOKING_CREATED]: 'booking',
  [AuditAction.BOOKING_STATUS_UPDATED]: 'booking',

  // Corporate Network
  [AuditAction.NETWORK_RELATION_CREATED]: 'network_relation',
  [AuditAction.NETWORK_RELATION_UPDATED]: 'network_relation',
  [AuditAction.NETWORK_RELATION_DELETED]: 'network_relation',
  [AuditAction.NETWORK_ENTITY_CREATED]: 'network_entity',
  [AuditAction.NETWORK_ENTITY_UPDATED]: 'network_entity',
  [AuditAction.NETWORK_ENTITY_MOVED]: 'network_entity',
  [AuditAction.NETWORK_ENTITY_DELETED]: 'network_entity',

  // Media Gallery
  [AuditAction.MEDIA_TAG_CREATED]: 'media_tag',
  [AuditAction.MEDIA_TAG_UPDATED]: 'media_tag',
  [AuditAction.MEDIA_TAG_DELETED]: 'media_tag',
  [AuditAction.MEDIA_FOLDER_CREATED]: 'media_folder',
  [AuditAction.MEDIA_FOLDER_UPDATED]: 'media_folder',
  [AuditAction.MEDIA_FOLDER_DELETED]: 'media_folder',
  [AuditAction.MEDIA_ITEM_CREATED]: 'media_item',
  [AuditAction.MEDIA_ITEM_UPDATED]: 'media_item',
  [AuditAction.MEDIA_ITEM_DELETED]: 'media_item',
  // Team & Leadership
  [AuditAction.TEAM_MEMBER_CREATED]: 'team_member',
  [AuditAction.TEAM_MEMBER_UPDATED]: 'team_member',
  [AuditAction.TEAM_MEMBER_DELETED]: 'team_member',

  // Testimonials
  [AuditAction.TESTIMONIAL_SUBMITTED]: 'testimonial',
  [AuditAction.TESTIMONIAL_APPROVED]: 'testimonial',
  [AuditAction.TESTIMONIAL_UNAPPROVED]: 'testimonial',
  [AuditAction.TESTIMONIAL_FAVORITED]: 'testimonial',
  [AuditAction.TESTIMONIAL_UNFAVORITED]: 'testimonial',
  [AuditAction.TESTIMONIAL_DELETED]: 'testimonial',

  // Contact
  [AuditAction.CONTACT_SUBMITTED]: 'contact_submission',
  [AuditAction.CONTACT_REVIEWED]: 'contact_submission',
  [AuditAction.CONTACT_DELETED]: 'contact_submission',

  // Awards
  [AuditAction.AWARD_CREATED]: 'award',
  [AuditAction.AWARD_UPDATED]: 'award',
  [AuditAction.AWARD_DELETED]: 'award',

  // Timeline
  [AuditAction.TIMELINE_ITEM_CREATED]: 'timeline_item',
  [AuditAction.TIMELINE_ITEM_UPDATED]: 'timeline_item',
  [AuditAction.TIMELINE_ITEM_DELETED]: 'timeline_item',

  // FAQ Category
  [AuditAction.FAQ_CATEGORY_CREATED]: 'faq_category',
  [AuditAction.FAQ_CATEGORY_UPDATED]: 'faq_category',
  [AuditAction.FAQ_CATEGORY_DELETED]: 'faq_category',

  // FAQ
  [AuditAction.FAQ_CREATED]: 'faq',
  [AuditAction.FAQ_UPDATED]: 'faq',
  [AuditAction.FAQ_REORDERED]: 'faq',
  [AuditAction.FAQ_DELETED]: 'faq',
};

const AUDIT_LOG_SORTABLE_FIELDS = new Set<keyof AuditLog>([
  'id',
  'action',
  'entityType',
  'entityId',
  'performedBy',
  'createdAt',
]);

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  log(
    action: AuditAction,
    performedBy: string,
    targetId: string,

    meta?: Record<string, any>,
  ): void {
    const entityType = ACTION_ENTITY_TYPE[action];

    if (!entityType) {
      this.logger.warn(`No mapping found for AuditAction: ${action}`);
    }

    const auditLog = this.auditLogRepository.create({
      action,
      entityType: entityType || 'unknown',
      entityId: targetId,
      performedBy,
      metadata: meta ?? null,
    });

    this.auditLogRepository.save(auditLog).catch((err: Error) => {
      this.logger.error(`Failed to save audit log: ${err.message}`, err.stack);
    });
  }

  async findAll(queryDto: QueryAuditLogDto): Promise<{
    data: AuditLog[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const requestedSortBy = queryDto.sortBy as keyof AuditLog | undefined;
    const sortBy =
      requestedSortBy && AUDIT_LOG_SORTABLE_FIELDS.has(requestedSortBy)
        ? requestedSortBy
        : 'createdAt';

    const sortOrder =
      (queryDto.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const query = this.auditLogRepository.createQueryBuilder('log');

    if (queryDto.action) {
      query.andWhere('log.action = :action', { action: queryDto.action });
    }

    if (queryDto.entityType) {
      query.andWhere('log.entityType = :entityType', {
        entityType: queryDto.entityType,
      });
    }

    if (queryDto.performedBy) {
      query.andWhere('log.performedBy = :performedBy', {
        performedBy: queryDto.performedBy,
      });
    }

    if (queryDto.startDate) {
      query.andWhere('log.createdAt >= :startDate', {
        startDate: queryDto.startDate,
      });
    }

    if (queryDto.endDate) {
      query.andWhere('log.createdAt <= :endDate', {
        endDate: queryDto.endDate,
      });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('log.entityType LIKE :search', { search }).orWhere(
            'log.performedBy LIKE :search',
            { search },
          );
        }),
      );
    }

    query
      .orderBy(`log.${sortBy}`, sortOrder)
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
}
