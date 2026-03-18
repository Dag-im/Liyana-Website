import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { FaqCategory } from '../entities/faq-category.entity';
import { Faq } from '../entities/faq.entity';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq-category.dto';

@Injectable()
export class FaqCategoriesService {
  constructor(
    @InjectRepository(FaqCategory)
    private readonly faqCategoryRepository: Repository<FaqCategory>,
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll() {
    return this.faqCategoryRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const category = await this.faqCategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`FAQ Category with ID ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateFaqCategoryDto, performedBy: string) {
    const slug = this.generateSlug(dto.name);

    const existing = await this.faqCategoryRepository.findOne({
      where: [{ name: dto.name }, { slug }],
    });

    if (existing) {
      throw new ConflictException('FAQ Category already exists');
    }

    const category = this.faqCategoryRepository.create({
      ...dto,
      slug,
    });

    const saved = await this.faqCategoryRepository.save(category);

    this.auditLogService.log(
      AuditAction.FAQ_CATEGORY_CREATED,
      performedBy,
      saved.id,
      { name: saved.name },
    );

    return saved;
  }

  async update(id: string, dto: UpdateFaqCategoryDto, performedBy: string) {
    const category = await this.findOne(id);

    if (dto.name && dto.name !== category.name) {
      const slug = this.generateSlug(dto.name);
      const existing = await this.faqCategoryRepository.findOne({
        where: [{ name: dto.name }, { slug }],
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('FAQ Category already exists');
      }

      category.name = dto.name;
      category.slug = slug;
    }

    if (dto.sortOrder !== undefined) {
      category.sortOrder = dto.sortOrder;
    }

    const saved = await this.faqCategoryRepository.save(category);

    this.auditLogService.log(
      AuditAction.FAQ_CATEGORY_UPDATED,
      performedBy,
      saved.id,
      { name: saved.name },
    );

    return saved;
  }

  async remove(id: string, performedBy: string) {
    const category = await this.findOne(id);

    const faqsCount = await this.faqRepository.count({
      where: { categoryId: category.id },
    });

    if (faqsCount > 0) {
      throw new ConflictException(
        'Cannot delete a category that has FAQs assigned to it',
      );
    }

    await this.faqCategoryRepository.delete(id);

    this.auditLogService.log(
      AuditAction.FAQ_CATEGORY_DELETED,
      performedBy,
      id,
      { name: category.name },
    );

    return { message: 'FAQ Category deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
