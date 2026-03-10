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

  // Bookings
  [AuditAction.BOOKING_CREATED]: 'booking',
  [AuditAction.BOOKING_STATUS_UPDATED]: 'booking',
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
