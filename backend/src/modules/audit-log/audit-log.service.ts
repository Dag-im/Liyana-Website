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

  // CMS
  [AuditAction.CMS_MISSION_VISION_UPDATED]: 'cms',
  [AuditAction.CMS_WHO_WE_ARE_UPDATED]: 'cms',
  [AuditAction.CMS_CORE_VALUE_CREATED]: 'cms',
  [AuditAction.CMS_CORE_VALUE_UPDATED]: 'cms',
  [AuditAction.CMS_CORE_VALUE_DELETED]: 'cms',
  [AuditAction.CMS_STAT_CREATED]: 'cms',
  [AuditAction.CMS_STAT_UPDATED]: 'cms',
  [AuditAction.CMS_STAT_DELETED]: 'cms',
  [AuditAction.CMS_QUALITY_POLICY_UPDATED]: 'cms',
  [AuditAction.CMS_QUALITY_POLICY_DELETED]: 'cms',
  [AuditAction.ESG_HERO_UPDATED]: 'esg',
  [AuditAction.ESG_STRATEGY_UPDATED]: 'esg',
  [AuditAction.ESG_LUCS_BRIDGE_UPDATED]: 'esg',
  [AuditAction.ESG_PILLAR_CREATED]: 'esg',
  [AuditAction.ESG_PILLAR_UPDATED]: 'esg',
  [AuditAction.ESG_PILLAR_DELETED]: 'esg',
  [AuditAction.ESG_METRIC_CREATED]: 'esg',
  [AuditAction.ESG_METRIC_UPDATED]: 'esg',
  [AuditAction.ESG_METRIC_DELETED]: 'esg',
  [AuditAction.ESG_GOVERNANCE_CREATED]: 'esg',
  [AuditAction.ESG_GOVERNANCE_UPDATED]: 'esg',
  [AuditAction.ESG_GOVERNANCE_DELETED]: 'esg',
  [AuditAction.ESG_REPORT_CREATED]: 'esg',
  [AuditAction.ESG_REPORT_UPDATED]: 'esg',
  [AuditAction.ESG_REPORT_DELETED]: 'esg',
  [AuditAction.IR_HERO_UPDATED]: 'ir',
  [AuditAction.IR_STRATEGY_UPDATED]: 'ir',
  [AuditAction.IR_CONTACT_UPDATED]: 'ir',
  [AuditAction.IR_KPI_CREATED]: 'ir',
  [AuditAction.IR_KPI_UPDATED]: 'ir',
  [AuditAction.IR_KPI_DELETED]: 'ir',
  [AuditAction.IR_FINANCIAL_ROW_CREATED]: 'ir',
  [AuditAction.IR_FINANCIAL_ROW_UPDATED]: 'ir',
  [AuditAction.IR_FINANCIAL_ROW_DELETED]: 'ir',
  [AuditAction.IR_CHART_CREATED]: 'ir',
  [AuditAction.IR_CHART_UPDATED]: 'ir',
  [AuditAction.IR_CHART_DELETED]: 'ir',
  [AuditAction.IR_DOCUMENT_CREATED]: 'ir',
  [AuditAction.IR_DOCUMENT_UPDATED]: 'ir',
  [AuditAction.IR_DOCUMENT_DELETED]: 'ir',
  [AuditAction.IR_INQUIRY_SUBMITTED]: 'ir',
  [AuditAction.IR_INQUIRY_REVIEWED]: 'ir',
  [AuditAction.IR_INQUIRY_DELETED]: 'ir',
  [AuditAction.LUCS_HERO_UPDATED]: 'lucs',
  [AuditAction.LUCS_WHO_WE_ARE_UPDATED]: 'lucs',
  [AuditAction.LUCS_MISSION_UPDATED]: 'lucs',
  [AuditAction.LUCS_PILLAR_INTRO_UPDATED]: 'lucs',
  [AuditAction.LUCS_CTA_UPDATED]: 'lucs',
  [AuditAction.LUCS_PILLAR_CREATED]: 'lucs',
  [AuditAction.LUCS_PILLAR_UPDATED]: 'lucs',
  [AuditAction.LUCS_PILLAR_DELETED]: 'lucs',
  [AuditAction.LUCS_INQUIRY_SUBMITTED]: 'lucs',
  [AuditAction.LUCS_INQUIRY_REVIEWED]: 'lucs',
  [AuditAction.LUCS_INQUIRY_DELETED]: 'lucs',
};

const AUDIT_LOG_SORTABLE_FIELDS = new Set<keyof AuditLog>([
  'id',
  'action',
  'entityType',
  'entityId',
  'performedBy',
  'createdAt',
]);

type AuditLogWithDisplay = AuditLog & {
  entityName: string;
  performedByName: string;
  performedByEmail: string | null;
};

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);
  private readonly retentionMonths = 6;
  private readonly cleanupIntervalMs = 6 * 60 * 60 * 1000;
  private lastCleanupAt = 0;

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

    void this.cleanupExpiredLogs();
  }

  async findAll(queryDto: QueryAuditLogDto): Promise<{
    data: AuditLogWithDisplay[];
    total: number;
    page: number;
    perPage: number;
  }> {
    await this.cleanupExpiredLogs();

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
    const enriched = await this.enrichLogs(data);

    return {
      data: enriched,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: string): Promise<AuditLogWithDisplay | null> {
    await this.cleanupExpiredLogs();

    const log = await this.auditLogRepository.findOne({ where: { id } });
    if (!log) {
      return null;
    }

    const [enriched] = await this.enrichLogs([log]);
    return enriched ?? null;
  }

  private async enrichLogs(logs: AuditLog[]): Promise<AuditLogWithDisplay[]> {
    const actorIds = Array.from(
      new Set(
        logs
          .map((log) => log.performedBy)
          .filter(
            (value) =>
              value &&
              value !== 'public' &&
              /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                value,
              ),
          ),
      ),
    );

    const userById = new Map<string, { name: string; email: string }>();
    if (actorIds.length > 0) {
      const users = await this.auditLogRepository.manager
        .createQueryBuilder()
        .select('u.id', 'id')
        .addSelect('u.name', 'name')
        .addSelect('u.email', 'email')
        .from('users', 'u')
        .where('u.id IN (:...ids)', { ids: actorIds })
        .getRawMany<{ id: string; name: string; email: string }>();

      for (const user of users) {
        userById.set(user.id, { name: user.name, email: user.email });
      }
    }

    return logs.map((log) => {
      const metadata = this.safeMetadata(log.metadata);
      const actor = userById.get(log.performedBy);
      const performedByName =
        actor?.name ??
        this.pickMetadataText(metadata, [
          'performedByName',
          'actorName',
          'userName',
          'name',
          'email',
        ]) ??
        (log.performedBy === 'public' ? 'Public User' : 'System User');

      const entityName =
        this.pickMetadataText(metadata, [
          'entityName',
          'title',
          'name',
          'label',
          'categoryName',
          'divisionName',
          'blogTitle',
          'newsTitle',
          'eventTitle',
          'folderName',
          'tagName',
          'email',
        ]) ?? this.humanize(log.entityType);

      return {
        ...log,
        entityName,
        performedByName,
        performedByEmail: actor?.email ?? null,
      };
    });
  }

  private safeMetadata(
    metadata: Record<string, any> | null,
  ): Record<string, unknown> {
    return metadata && typeof metadata === 'object' ? metadata : {};
  }

  private pickMetadataText(
    metadata: Record<string, unknown>,
    keys: string[],
  ): string | null {
    for (const key of keys) {
      const value = metadata[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
    return null;
  }

  private humanize(value: string): string {
    return value
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private async cleanupExpiredLogs(): Promise<void> {
    const now = Date.now();
    if (
      this.lastCleanupAt &&
      now - this.lastCleanupAt < this.cleanupIntervalMs
    ) {
      return;
    }

    this.lastCleanupAt = now;

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - this.retentionMonths);

    try {
      const result = await this.auditLogRepository
        .createQueryBuilder()
        .delete()
        .from(AuditLog)
        .where('createdAt < :cutoff', { cutoff })
        .execute();

      if ((result.affected ?? 0) > 0) {
        this.logger.log(
          `Deleted ${result.affected} audit log(s) older than ${cutoff.toISOString()}`,
        );
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to cleanup old audit logs: ${err.message}`,
        err.stack,
      );
    }
  }
}
