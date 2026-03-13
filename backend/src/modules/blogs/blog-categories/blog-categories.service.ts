import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { Blog } from '../entities/blog.entity';
import { BlogCategory } from '../entities/blog-category.entity';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@Injectable()
export class BlogCategoriesService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll(): Promise<BlogCategory[]> {
    return this.blogCategoryRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<BlogCategory> {
    const category = await this.blogCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Blog category not found');
    }

    return category;
  }

  async create(
    dto: CreateBlogCategoryDto,
    performedBy: string,
  ): Promise<BlogCategory> {
    const slug = this.generateSlug(dto.name);

    const existing = await this.blogCategoryRepository.findOne({
      where: [{ name: dto.name }, { slug }],
    });

    if (existing) {
      throw new ConflictException('Blog category already exists');
    }

    const category = this.blogCategoryRepository.create({
      name: dto.name,
      slug,
    });

    const saved = await this.blogCategoryRepository.save(category);

    this.auditLogService.log(
      AuditAction.BLOG_CATEGORY_CREATED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async update(
    id: string,
    dto: UpdateBlogCategoryDto,
    performedBy: string,
  ): Promise<BlogCategory> {
    const category = await this.findOne(id);

    if (dto.name && dto.name !== category.name) {
      const slug = this.generateSlug(dto.name);
      const existing = await this.blogCategoryRepository.findOne({
        where: [{ name: dto.name }, { slug }],
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Blog category already exists');
      }

      category.name = dto.name;
      category.slug = slug;
    }

    const saved = await this.blogCategoryRepository.save(category);

    this.auditLogService.log(
      AuditAction.BLOG_CATEGORY_UPDATED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async remove(id: string, performedBy: string): Promise<{ message: string }> {
    const category = await this.findOne(id);

    const blogsCount = await this.blogRepository.count({
      where: { categoryId: category.id },
      withDeleted: true,
    });

    if (blogsCount > 0) {
      throw new ConflictException(
        'Cannot delete a category that has blog posts assigned to it',
      );
    }

    await this.blogCategoryRepository.delete(category.id);

    this.auditLogService.log(
      AuditAction.BLOG_CATEGORY_DELETED,
      performedBy,
      category.id,
    );

    return { message: 'Blog category deleted successfully' };
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
