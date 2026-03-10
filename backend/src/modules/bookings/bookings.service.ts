import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { NotificationUrgency } from '../../common/types/notification-urgency.enum';
import { UserRole } from '../../common/types/user-role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { DivisionsService } from '../services/divisions/divisions.service';
import { Doctor } from '../services/entities/doctor.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking, SelectionType } from './entity/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly divisionsService: DivisionsService,
    private readonly notificationsService: NotificationsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const division = await this.divisionsService.findOne(dto.divisionId);

    if (division.isActive === false) {
      throw new BadRequestException(
        'Division is not currently accepting bookings',
      );
    }

    if (dto.selectionType === SelectionType.DOCTOR) {
      if (!dto.selectionId) {
        throw new BadRequestException(
          'Doctor ID is required for doctor selection type',
        );
      }
      const doctor = await this.doctorRepository.findOne({
        where: { id: dto.selectionId, divisionId: dto.divisionId },
      });
      if (!doctor) {
        throw new NotFoundException('Doctor not found in this division');
      }
    }

    const booking = this.bookingsRepository.create({
      ...dto,
      divisionName: division.name,
    });

    const saved = await this.bookingsRepository.save(booking);

    void this.notificationsService.create(
      {
        title: 'New Booking Request',
        message: `New booking from ${dto.patientName} for ${dto.selectionLabel} at ${division.name}`,
        urgency: NotificationUrgency.MEDIUM,
        targetRole: UserRole.CUSTOMER_SERVICE,
        relatedEntityType: 'booking',
        relatedEntityId: saved.id,
      },
      'system',
    );

    this.auditLogService.log(AuditAction.BOOKING_CREATED, 'public', saved.id);

    return saved;
  }

  async findAll(
    queryDto: QueryBookingDto,
    user: { sub: string; role: UserRole; divisionId: string | null },
  ): Promise<{
    data: Booking[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.bookingsRepository.createQueryBuilder('booking');

    if (user.role === UserRole.ADMIN) {
      if (queryDto.divisionId) {
        query.andWhere('booking.divisionId = :divisionId', {
          divisionId: queryDto.divisionId,
        });
      }
    } else if (user.role === UserRole.CUSTOMER_SERVICE) {
      if (!user.divisionId) {
        throw new ForbiddenException('No division assigned to this account');
      }
      query.andWhere('booking.divisionId = :divisionId', {
        divisionId: user.divisionId,
      });
    } else {
      throw new ForbiddenException('Access denied');
    }

    if (queryDto.status) {
      query.andWhere('booking.status = :status', { status: queryDto.status });
    }

    if (queryDto.selectionType) {
      query.andWhere('booking.selectionType = :type', {
        type: queryDto.selectionType,
      });
    }

    if (queryDto.startDate) {
      query.andWhere('booking.createdAt >= :startDate', {
        startDate: queryDto.startDate,
      });
    }

    if (queryDto.endDate) {
      query.andWhere('booking.createdAt <= :endDate', {
        endDate: queryDto.endDate,
      });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('booking.patientName LIKE :search', { search }).orWhere(
            'booking.patientPhone LIKE :search',
            { search },
          );
        }),
      );
    }

    query.orderBy('booking.createdAt', 'DESC');
    query.skip((page - 1) * perPage).take(perPage);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, perPage };
  }

  async findOne(
    id: string,
    user: { sub: string; role: UserRole; divisionId: string | null },
  ): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (user.role === UserRole.ADMIN) {
      return booking;
    }

    if (user.role === UserRole.CUSTOMER_SERVICE) {
      if (booking.divisionId !== user.divisionId) {
        throw new ForbiddenException('Access denied to this booking');
      }
      return booking;
    }

    throw new ForbiddenException('Access denied');
  }

  async updateStatus(
    id: string,
    dto: UpdateBookingStatusDto,
    user: { sub: string; role: UserRole; divisionId: string | null },
  ): Promise<Booking> {
    const booking = await this.findOne(id, user); // findOne already enforces role check

    const previousStatus = booking.status;
    booking.status = dto.status;
    if (dto.notes !== undefined) {
      booking.notes = dto.notes;
    }

    const saved = await this.bookingsRepository.save(booking);

    this.auditLogService.log(
      AuditAction.BOOKING_STATUS_UPDATED,
      user.sub,
      saved.id,
      {
        previousStatus,
        newStatus: dto.status,
      },
    );

    return saved;
  }
}
