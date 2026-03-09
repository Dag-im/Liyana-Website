import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UserRole } from '../../common/types/user-role.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { Notification } from './entity/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    dto: CreateNotificationDto,
    performedBy: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...dto,
      createdBy: performedBy,
    });

    const savedNotification =
      await this.notificationRepository.save(notification);

    this.auditLogService.log(
      AuditAction.NOTIFICATION_CREATED,
      performedBy,
      savedNotification.id,
    );

    return savedNotification;
  }

  async findForRole(
    role: UserRole,
    queryDto: QueryNotificationDto,
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.notificationRepository.createQueryBuilder('notif');
    query.where('notif.targetRole = :role', { role });

    if (queryDto.isRead !== undefined) {
      query.andWhere('notif.isRead = :isRead', { isRead: queryDto.isRead });
    }

    query
      .orderBy('notif.isRead', 'ASC')
      .addOrderBy('notif.createdAt', 'DESC')
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

  async getUnreadCount(role: UserRole): Promise<{ count: number }> {
    const count = await this.notificationRepository.count({
      where: { targetRole: role, isRead: false },
    });
    return { count };
  }

  async markRead(id: string, userRole: UserRole): Promise<{ message: string }> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    if (notification.targetRole !== userRole) {
      throw new ForbiddenException(
        'You are not allowed to update this notification.',
      );
    }

    notification.isRead = true;
    await this.notificationRepository.save(notification);

    return { message: 'Notification marked as read' };
  }
}
