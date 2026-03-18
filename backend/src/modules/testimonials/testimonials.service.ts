import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { QueryTestimonialDto } from './dto/query-testimonial.dto';
import { Testimonial } from './entity/testimonial.entity';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateTestimonialDto): Promise<Testimonial> {
    const testimonial = this.testimonialRepository.create({
      ...dto,
      isApproved: false,
      isFavorite: false,
    });

    const saved = await this.testimonialRepository.save(testimonial);

    this.auditLogService.log(
      AuditAction.TESTIMONIAL_SUBMITTED,
      'public',
      saved.id,
    );

    return saved;
  }

  async findAll(
    queryDto: QueryTestimonialDto,
    includeAll = false,
  ): Promise<{
    data: Testimonial[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 10;
    const query = this.testimonialRepository.createQueryBuilder('testimonial');

    // Default filter for public: only approved
    const isApprovedFilter = queryDto.isApproved;
    if (!includeAll && isApprovedFilter === undefined) {
      query.andWhere('testimonial.isApproved = :isApproved', {
        isApproved: true,
      });
    } else if (isApprovedFilter !== undefined) {
      query.andWhere('testimonial.isApproved = :isApproved', {
        isApproved: isApprovedFilter,
      });
    }

    if (queryDto.isFavorite !== undefined) {
      query.andWhere('testimonial.isFavorite = :isFavorite', {
        isFavorite: queryDto.isFavorite,
      });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('testimonial.name LIKE :search', { search })
            .orWhere('testimonial.company LIKE :search', { search })
            .orWhere('testimonial.role LIKE :search', { search });
        }),
      );
    }

    query
      .orderBy('testimonial.createdAt', 'DESC')
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

  async approve(id: string, performedBy: string): Promise<Testimonial> {
    const testimonial = await this.findOneOrThrow(id);

    if (testimonial.isApproved) {
      throw new BadRequestException('Already approved');
    }

    testimonial.isApproved = true;
    const updated = await this.testimonialRepository.save(testimonial);

    this.auditLogService.log(
      AuditAction.TESTIMONIAL_APPROVED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async unapprove(id: string, performedBy: string): Promise<Testimonial> {
    const testimonial = await this.findOneOrThrow(id);

    if (!testimonial.isApproved) {
      throw new BadRequestException('Not approved');
    }

    testimonial.isApproved = false;
    testimonial.isFavorite = false;
    const updated = await this.testimonialRepository.save(testimonial);

    this.auditLogService.log(
      AuditAction.TESTIMONIAL_UNAPPROVED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async favorite(id: string, performedBy: string): Promise<Testimonial> {
    const testimonial = await this.findOneOrThrow(id);

    if (!testimonial.isApproved) {
      throw new BadRequestException(
        'Testimonial must be approved before favoriting',
      );
    }

    if (testimonial.isFavorite) {
      throw new BadRequestException('Already favorited');
    }

    testimonial.isFavorite = true;
    const updated = await this.testimonialRepository.save(testimonial);

    this.auditLogService.log(
      AuditAction.TESTIMONIAL_FAVORITED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async unfavorite(id: string, performedBy: string): Promise<Testimonial> {
    const testimonial = await this.findOneOrThrow(id);

    if (!testimonial.isFavorite) {
      throw new BadRequestException('Not favorited');
    }

    testimonial.isFavorite = false;
    const updated = await this.testimonialRepository.save(testimonial);

    this.auditLogService.log(
      AuditAction.TESTIMONIAL_UNFAVORITED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async remove(id: string, performedBy: string): Promise<void> {
    const testimonial = await this.findOneOrThrow(id);
    await this.testimonialRepository.softRemove(testimonial);

    this.auditLogService.log(AuditAction.TESTIMONIAL_DELETED, performedBy, id);
  }

  private async findOneOrThrow(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return testimonial;
  }
}
