import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { Faq } from '../entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { QueryFaqDto } from './dto/query-faq.dto';
import { ReorderFaqDto } from './dto/reorder-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqCategoriesService } from '../faq-categories/faq-categories.service';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    private readonly faqCategoriesService: FaqCategoriesService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateFaqDto, performedBy: string) {
    await this.faqCategoriesService.findOne(dto.categoryId);

    let position = dto.position;
    if (position === undefined) {
      const maxPosition = await this.faqRepository
        .createQueryBuilder('faq')
        .where('faq.categoryId = :categoryId', { categoryId: dto.categoryId })
        .select('MAX(faq.position)', 'max')
        .getRawOne();
      position = (maxPosition?.max ?? -1) + 1;
    }

    const faq = this.faqRepository.create({
      ...dto,
      position,
    });

    const saved = await this.faqRepository.save(faq);

    this.auditLogService.log(AuditAction.FAQ_CREATED, performedBy, saved.id, {
      question: saved.question,
    });

    return saved;
  }

  async findAll(queryDto: QueryFaqDto) {
    const { page = 1, perPage = 10, search, categoryId } = queryDto;

    const query = this.faqRepository.createQueryBuilder('faq');

    if (search) {
      query.andWhere('(faq.question LIKE :search OR faq.answer LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      query.andWhere('faq.categoryId = :categoryId', { categoryId });
    }

    query
      .leftJoinAndSelect('faq.category', 'category')
      .orderBy('faq.position', 'ASC')
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

  async findOne(id: string) {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async update(id: string, dto: UpdateFaqDto, performedBy: string) {
    const faq = await this.findOne(id);

    if (dto.categoryId && dto.categoryId !== faq.categoryId) {
      await this.faqCategoriesService.findOne(dto.categoryId);
    }

    Object.assign(faq, dto);
    const saved = await this.faqRepository.save(faq);

    this.auditLogService.log(AuditAction.FAQ_UPDATED, performedBy, saved.id, {
      question: saved.question,
    });

    return saved;
  }

  async reorder(id: string, dto: ReorderFaqDto, performedBy: string) {
    const faq = await this.findOne(id);
    faq.position = dto.position;
    const saved = await this.faqRepository.save(faq);

    this.auditLogService.log(AuditAction.FAQ_REORDERED, performedBy, saved.id, {
      position: saved.position,
    });

    return saved;
  }

  async remove(id: string, performedBy: string) {
    const faq = await this.findOne(id);
    await this.faqRepository.softRemove(faq);

    this.auditLogService.log(AuditAction.FAQ_DELETED, performedBy, id, {
      question: faq.question,
    });

    return { message: 'FAQ deleted successfully' };
  }
}
