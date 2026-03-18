import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { ContactSubmission } from './entity/contact-submission.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly contactRepository: Repository<ContactSubmission>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactSubmission> {
    const submission = this.contactRepository.create({
      ...dto,
      isReviewed: false,
    });

    const saved = await this.contactRepository.save(submission);

    this.auditLogService.log(AuditAction.CONTACT_SUBMITTED, 'public', saved.id);

    return saved;
  }

  async findAll(queryDto: QueryContactDto): Promise<{
    data: ContactSubmission[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 10;
    const query = this.contactRepository.createQueryBuilder('contact');

    if (queryDto.isReviewed !== undefined) {
      query.andWhere('contact.isReviewed = :isReviewed', {
        isReviewed: queryDto.isReviewed,
      });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('contact.name LIKE :search', { search }).orWhere(
            'contact.email LIKE :search',
            { search },
          );
        }),
      );
    }

    query
      .orderBy('contact.createdAt', 'DESC')
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

  async findOne(id: string): Promise<ContactSubmission> {
    const submission = await this.contactRepository.findOne({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`Contact submission with ID ${id} not found`);
    }

    return submission;
  }

  async review(id: string, performedBy: string): Promise<ContactSubmission> {
    const submission = await this.findOne(id);

    if (submission.isReviewed) {
      throw new BadRequestException('Already marked as reviewed');
    }

    submission.isReviewed = true;
    submission.reviewedAt = new Date();

    const updated = await this.contactRepository.save(submission);

    this.auditLogService.log(
      AuditAction.CONTACT_REVIEWED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async remove(id: string, performedBy: string): Promise<void> {
    const submission = await this.findOne(id);
    await this.contactRepository.softRemove(submission);

    this.auditLogService.log(AuditAction.CONTACT_DELETED, performedBy, id);
  }
}
