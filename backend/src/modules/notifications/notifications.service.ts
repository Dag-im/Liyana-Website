import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UserRole } from '../../common/types/user-role.enum';
import { User } from '../users/entity/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { Notification } from './entity/notification.entity';

type NotificationPayload = Omit<
  CreateNotificationDto,
  'targetUserId' | 'targetRole'
>;

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async createForUser(
    targetUserId: string,
    dto: NotificationPayload,
    performedBy: string,
  ): Promise<Notification | null> {
    const user = await this.userRepository.findOne({
      where: { id: targetUserId, isActive: true },
      select: ['id', 'role'],
    });

    if (!user) {
      return null;
    }

    return this.create(
      {
        ...dto,
        targetUserId: user.id,
        targetRole: user.role,
      },
      performedBy,
    );
  }

  async createForUsers(
    targetUserIds: string[],
    dto: NotificationPayload,
    performedBy: string,
  ): Promise<Notification[]> {
    if (targetUserIds.length === 0) {
      return [];
    }

    const uniqueUserIds = [...new Set(targetUserIds)];
    const users = await this.userRepository.find({
      where: {
        id: In(uniqueUserIds),
        isActive: true,
      },
      select: ['id', 'role'],
    });

    if (users.length === 0) {
      return [];
    }

    const notifications = users.map((user) =>
      this.notificationRepository.create({
        ...dto,
        targetUserId: user.id,
        targetRole: user.role,
        createdBy: performedBy,
      }),
    );

    const savedNotifications =
      await this.notificationRepository.save(notifications);

    savedNotifications.forEach((notification) => {
      this.auditLogService.log(
        AuditAction.NOTIFICATION_CREATED,
        performedBy,
        notification.id,
      );
    });

    return savedNotifications;
  }

  async createForRoles(
    targetRoles: UserRole[],
    dto: NotificationPayload,
    performedBy: string,
  ): Promise<Notification[]> {
    if (targetRoles.length === 0) {
      return [];
    }

    const users = await this.userRepository.find({
      where: {
        role: In([...new Set(targetRoles)]),
        isActive: true,
      },
      select: ['id'],
    });

    return this.createForUsers(
      users.map((user) => user.id),
      dto,
      performedBy,
    );
  }

  async findForUser(
    userId: string,
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
    query.where(
      '(notif.targetUserId = :userId OR (notif.targetUserId IS NULL AND notif.targetRole = :role))',
      { userId, role },
    );

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

  async getUnreadCount(
    userId: string,
    role: UserRole,
  ): Promise<{ count: number }> {
    const count = await this.notificationRepository
      .createQueryBuilder('notif')
      .where(
        '(notif.targetUserId = :userId OR (notif.targetUserId IS NULL AND notif.targetRole = :role))',
        { userId, role },
      )
      .andWhere('notif.isRead = :isRead', { isRead: false })
      .getCount();

    return { count };
  }

  async markRead(
    id: string,
    userId: string,
    role: UserRole,
  ): Promise<{ message: string }> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    const isRecipient =
      notification.targetUserId === userId ||
      (notification.targetUserId === null && notification.targetRole === role);

    if (!isRecipient) {
      throw new ForbiddenException(
        'You are not allowed to update this notification.',
      );
    }

    notification.isRead = true;
    await this.notificationRepository.save(notification);

    return { message: 'Notification marked as read' };
  }
}
