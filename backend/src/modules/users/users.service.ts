import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Brackets, DataSource, IsNull, Repository } from 'typeorm';

import { BCRYPT_ROUNDS } from '../../common/constants/app.constants';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { NotificationUrgency } from '../../common/types/notification-urgency.enum';
import { UserRole } from '../../common/types/user-role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { DivisionsService } from '../services/divisions/divisions.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

const USER_SORTABLE_FIELDS = new Set<keyof User>([
  'name',
  'email',
  'role',
  'isActive',
  'createdAt',
  'updatedAt',
]);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService,
    private readonly divisionsService: DivisionsService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    performedBy: string,
  ): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (existingUser && existingUser.isActive) {
      throw new ConflictException(
        'Email is already in use by an active account.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_ROUNDS,
    );

    const resolvedRole = createUserDto.role ?? UserRole.BLOGGER;
    const normalizedAuthorProfile = this.normalizeAuthorProfile({
      role: resolvedRole,
      name: createUserDto.name,
      authorName: createUserDto.authorName,
      authorRole: createUserDto.authorRole,
    });

    if (resolvedRole === UserRole.DIVISION_MANAGER) {
      if (!createUserDto.divisionId) {
        throw new BadRequestException(
          'DIVISION_MANAGER must be assigned to a division',
        );
      }
      const existingDivisionManager = await this.usersRepository.findOne({
        where: {
          role: UserRole.DIVISION_MANAGER,
          divisionId: createUserDto.divisionId,
          deletedAt: IsNull(),
        },
      });
      if (existingDivisionManager) {
        throw new ConflictException(
          'A division manager already exists for this division',
        );
      }
      await this.divisionsService.findOne(createUserDto.divisionId);
    }

    if (
      resolvedRole === UserRole.CUSTOMER_SERVICE ||
      resolvedRole === UserRole.DIVISION_MANAGER
    ) {
      if (!createUserDto.divisionId) {
        throw new BadRequestException(
          `${resolvedRole} users must have a divisionId`,
        );
      }
      await this.divisionsService.findOne(createUserDto.divisionId);
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: resolvedRole,
      authorName: normalizedAuthorProfile.authorName,
      authorRole: normalizedAuthorProfile.authorRole,
      isActive: createUserDto.isActive ?? true,
      divisionId:
        resolvedRole === UserRole.CUSTOMER_SERVICE ||
        resolvedRole === UserRole.DIVISION_MANAGER
          ? (createUserDto.divisionId ?? null)
          : null,
    });

    const savedUser = await this.usersRepository.save(user);

    if (savedUser.role === UserRole.BLOGGER) {
      await this.syncBlogAuthorProfile(
        savedUser.id,
        savedUser.authorName ?? savedUser.name,
        savedUser.authorRole ?? 'Blogger',
      );
    }

    void this.notificationsService.createForUser(
      savedUser.id,
      {
        title: 'Account Created',
        message: `Your account has been created with role ${savedUser.role}${savedUser.divisionId ? ` and division ${savedUser.divisionId}` : ''}.`,
        urgency: NotificationUrgency.MEDIUM,
        relatedEntityType: 'user',
        relatedEntityId: savedUser.id,
      },
      performedBy,
    );

    this.auditLogService.log(
      AuditAction.USER_CREATED,
      performedBy,
      savedUser.id,
    );

    return savedUser;
  }

  async findAll(queryUserDto: QueryUserDto): Promise<{
    data: User[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryUserDto.page ?? 1;
    const perPage = queryUserDto.perPage ?? 20;

    const requestedSortBy = queryUserDto.sortBy as keyof User | undefined;
    const sortBy =
      requestedSortBy && USER_SORTABLE_FIELDS.has(requestedSortBy)
        ? requestedSortBy
        : 'createdAt';

    const sortOrder =
      (queryUserDto.sortOrder ?? 'DESC').toUpperCase() === 'ASC'
        ? 'ASC'
        : 'DESC';

    const query = this.usersRepository.createQueryBuilder('user');

    if (queryUserDto.role) {
      query.andWhere('user.role = :role', { role: queryUserDto.role });
    }

    if (queryUserDto.divisionId) {
      query.andWhere('user.divisionId = :divisionId', {
        divisionId: queryUserDto.divisionId,
      });
    }

    if (queryUserDto.search) {
      const search = `%${queryUserDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('user.name LIKE :search', { search }).orWhere(
            'user.email LIKE :search',
            { search },
          );
        }),
      );
    }

    if (queryUserDto.startDate) {
      query.andWhere('user.createdAt >= :startDate', {
        startDate: queryUserDto.startDate,
      });
    }

    if (queryUserDto.endDate) {
      const end = new Date(queryUserDto.endDate);
      end.setDate(end.getDate() + 1);
      query.andWhere('user.createdAt < :endDate', {
        endDate: end.toISOString(),
      });
    }

    query
      .orderBy(`user.${sortBy}`, sortOrder)
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

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['division'],
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    // For login, only return non-deleted users
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    performedBy: string,
    callerRole?: UserRole,
    callerDivisionId?: string | null,
  ): Promise<User> {
    const user = await this.findOne(id);
    const isDivisionManagerCaller = callerRole === UserRole.DIVISION_MANAGER;

    const dto: UpdateUserDto = { ...updateUserDto };

    if (isDivisionManagerCaller) {
      if (!callerDivisionId || user.divisionId !== callerDivisionId) {
        throw new ForbiddenException(
          'Division managers can only manage users in their own division',
        );
      }

      if (user.role !== UserRole.CUSTOMER_SERVICE) {
        throw new ForbiddenException(
          'Division managers can only manage customer service users',
        );
      }

      if (dto.role && dto.role !== UserRole.CUSTOMER_SERVICE) {
        throw new BadRequestException(
          'Division managers can only manage customer service users',
        );
      }

      delete dto.role;
      delete dto.divisionId;
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: dto.email },
        withDeleted: true,
      });

      if (existingUser && existingUser.id !== id && existingUser.isActive) {
        throw new ConflictException(
          'Email is already in use by another active account.',
        );
      }
    }

    const incomingRole = dto.role ?? user.role;
    const effectiveDivisionId =
      incomingRole === UserRole.CUSTOMER_SERVICE ||
      incomingRole === UserRole.DIVISION_MANAGER
        ? (dto.divisionId ?? user.divisionId)
        : null;
    const nextName = dto.name ?? user.name;
    const normalizedAuthorProfile = this.normalizeAuthorProfile({
      role: incomingRole,
      name: nextName,
      authorName: dto.authorName ?? user.authorName,
      authorRole: dto.authorRole ?? user.authorRole,
    });

    if (
      incomingRole === UserRole.CUSTOMER_SERVICE ||
      incomingRole === UserRole.DIVISION_MANAGER
    ) {
      if (!effectiveDivisionId) {
        throw new BadRequestException(
          `${incomingRole} users must have a divisionId`,
        );
      }
      await this.divisionsService.findOne(effectiveDivisionId);
    }

    const updatedUser = this.usersRepository.merge(user, {
      ...dto,
      divisionId: effectiveDivisionId,
      authorName: normalizedAuthorProfile.authorName,
      authorRole: normalizedAuthorProfile.authorRole,
    });
    const savedUser = await this.usersRepository.save(updatedUser);

    if (savedUser.role === UserRole.BLOGGER) {
      await this.syncBlogAuthorProfile(
        savedUser.id,
        savedUser.authorName ?? savedUser.name,
        savedUser.authorRole ?? 'Blogger',
      );
    }

    void this.notificationsService.createForUser(
      savedUser.id,
      {
        title: 'Account Updated',
        message: `Your account profile was updated. Current role: ${savedUser.role}${savedUser.divisionId ? `, division: ${savedUser.divisionId}` : ''}.`,
        urgency: NotificationUrgency.MEDIUM,
        relatedEntityType: 'user',
        relatedEntityId: savedUser.id,
      },
      performedBy,
    );

    this.auditLogService.log(
      AuditAction.USER_UPDATED,
      performedBy,
      savedUser.id,
    );

    return savedUser;
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
    performedBy: string,
  ): Promise<{ message: string }> {
    const user = await this.findOne(id);

    user.password = await bcrypt.hash(
      changePasswordDto.newPassword,
      BCRYPT_ROUNDS,
    );
    await this.usersRepository.save(user);

    void this.notificationsService.createForUser(
      user.id,
      {
        title: 'Password Changed',
        message: 'Your account password was changed by an administrator.',
        urgency: NotificationUrgency.CRITICAL,
        relatedEntityType: 'user',
        relatedEntityId: user.id,
      },
      performedBy,
    );

    this.auditLogService.log(
      AuditAction.PASSWORD_CHANGED_BY_ADMIN,
      performedBy,
      id,
      { targetUserId: id },
    );

    return { message: 'Password updated successfully' };
  }

  async remove(
    id: string,
    performedBy: string,
    callerRole?: UserRole,
    callerDivisionId?: string | null,
  ): Promise<{ message: string }> {
    const user = await this.findOne(id);

    if (callerRole === UserRole.DIVISION_MANAGER) {
      if (!callerDivisionId || user.divisionId !== callerDivisionId) {
        throw new ForbiddenException(
          'Division managers can only manage users in their own division',
        );
      }

      if (user.role !== UserRole.CUSTOMER_SERVICE) {
        throw new ForbiddenException(
          'Division managers can only manage customer service users',
        );
      }
    }

    user.isActive = false;
    await this.usersRepository.save(user);
    await this.usersRepository.softDelete(id);

    this.auditLogService.log(AuditAction.USER_DEACTIVATED, performedBy, id);

    return { message: 'User deactivated successfully' };
  }

  private normalizeAuthorProfile(input: {
    role: UserRole;
    name: string;
    authorName?: string | null;
    authorRole?: string | null;
  }): { authorName: string | null; authorRole: string | null } {
    if (input.role !== UserRole.BLOGGER) {
      return { authorName: null, authorRole: null };
    }

    const authorName = input.authorName?.trim();
    const authorRole = input.authorRole?.trim();

    if (!authorName || !authorRole) {
      throw new BadRequestException(
        'BLOGGER users must have authorName and authorRole',
      );
    }

    return {
      authorName,
      authorRole,
    };
  }

  private async syncBlogAuthorProfile(
    authorId: string,
    authorName: string,
    authorRole: string,
  ): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update('blog_posts')
      .set({ authorName, authorRole })
      .where('authorId = :authorId', { authorId })
      .execute();
  }
}
