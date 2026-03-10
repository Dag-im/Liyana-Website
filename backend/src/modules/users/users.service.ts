import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Brackets, Repository } from 'typeorm';

import { BCRYPT_ROUNDS } from '../../common/constants/app.constants';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UserRole } from '../../common/types/user-role.enum';
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
    private readonly auditLogService: AuditLogService,
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

    if (createUserDto.role === UserRole.CUSTOMER_SERVICE) {
      if (!createUserDto.divisionId) {
        throw new BadRequestException(
          'CUSTOMER_SERVICE users must have a divisionId',
        );
      }
      await this.divisionsService.findOne(createUserDto.divisionId);
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role ?? UserRole.BLOGGER,
      isActive: createUserDto.isActive ?? true,
    });

    const savedUser = await this.usersRepository.save(user);

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
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
        withDeleted: true,
      });

      if (existingUser && existingUser.id !== id && existingUser.isActive) {
        throw new ConflictException(
          'Email is already in use by another active account.',
        );
      }
    }

    const incomingRole = updateUserDto.role ?? user.role;
    const effectiveDivisionId = updateUserDto.divisionId ?? user.divisionId;

    if (incomingRole === UserRole.CUSTOMER_SERVICE) {
      if (!effectiveDivisionId) {
        throw new BadRequestException(
          'CUSTOMER_SERVICE users must have a divisionId',
        );
      }
      await this.divisionsService.findOne(effectiveDivisionId);
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    const savedUser = await this.usersRepository.save(updatedUser);

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

    this.auditLogService.log(
      AuditAction.PASSWORD_CHANGED_BY_ADMIN,
      performedBy,
      id,
      { targetUserId: id },
    );

    return { message: 'Password updated successfully' };
  }

  async remove(id: string, performedBy: string): Promise<{ message: string }> {
    const user = await this.findOne(id);

    user.isActive = false;
    await this.usersRepository.save(user);
    await this.usersRepository.softDelete(id);

    this.auditLogService.log(AuditAction.USER_DEACTIVATED, performedBy, id);

    return { message: 'User deactivated successfully' };
  }
}
