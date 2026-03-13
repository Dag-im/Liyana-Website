import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Brackets, Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UserRole } from '../../common/types/user-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { UsersService } from '../users/users.service';
import { BlogCategoriesService } from './blog-categories/blog-categories.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { RejectBlogDto } from './dto/reject-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog, BlogStatus } from './entities/blog.entity';

type JwtUserPayload = {
  sub: string;
  role: UserRole;
};

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly auditLogService: AuditLogService,
    private readonly uploadsService: UploadsService,
    private readonly usersService: UsersService,
    private readonly blogCategoriesService: BlogCategoriesService,
  ) {}

  async create(dto: CreateBlogDto, user: JwtUserPayload): Promise<Blog> {
    await this.blogCategoriesService.findOne(dto.categoryId);

    const author = await this.usersService.findOne(user.sub);

    const slug = await this.buildUniqueSlug(dto.title);

    const blog = this.blogRepository.create({
      title: dto.title,
      slug,
      excerpt: dto.excerpt,
      content: dto.content,
      image: dto.image,
      readTime: this.calculateReadTime(dto.content),
      featured: false,
      status: BlogStatus.DRAFT,
      rejectionReason: null,
      publishedAt: null,
      authorId: user.sub,
      authorName: author.name,
      authorRole: author.role,
      categoryId: dto.categoryId,
    });

    const saved = await this.blogRepository.save(blog);

    this.auditLogService.log(AuditAction.BLOG_CREATED, user.sub, saved.id);

    return saved;
  }

  async findAll(
    queryDto: QueryBlogDto,
    user?: JwtUserPayload,
  ): Promise<{
    data: Blog[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.category', 'category');

    const isAdminOrComm =
      user?.role === UserRole.ADMIN || user?.role === UserRole.COMMUNICATION;
    const isBlogger = user?.role === UserRole.BLOGGER;

    if (!user || (!isAdminOrComm && !isBlogger)) {
      query.andWhere('blog.status = :status', {
        status: BlogStatus.PUBLISHED,
      });
    } else if (isAdminOrComm) {
      if (queryDto.status) {
        query.andWhere('blog.status = :status', { status: queryDto.status });
      }
    } else if (isBlogger) {
      if (queryDto.status) {
        if (queryDto.status === BlogStatus.PUBLISHED) {
          query.andWhere('blog.status = :status', {
            status: BlogStatus.PUBLISHED,
          });
        } else {
          query
            .andWhere('blog.authorId = :authorId', { authorId: user.sub })
            .andWhere('blog.status = :status', { status: queryDto.status });
        }
      } else {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('blog.status = :published', {
              published: BlogStatus.PUBLISHED,
            }).orWhere(
              'blog.authorId = :authorId AND blog.status IN (:...statuses)',
              {
                authorId: user.sub,
                statuses: [
                  BlogStatus.DRAFT,
                  BlogStatus.REJECTED,
                  BlogStatus.PENDING_REVIEW,
                ],
              },
            );
          }),
        );
      }
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('blog.title LIKE :search', { search }).orWhere(
            'blog.excerpt LIKE :search',
            { search },
          );
        }),
      );
    }

    if (queryDto.categoryId) {
      query.andWhere('blog.categoryId = :categoryId', {
        categoryId: queryDto.categoryId,
      });
    }

    if (queryDto.authorId) {
      if (isBlogger && queryDto.authorId !== user?.sub) {
        query.andWhere('1 = 0');
      } else {
        query.andWhere('blog.authorId = :authorId', {
          authorId: queryDto.authorId,
        });
      }
    }

    if (queryDto.featured !== undefined) {
      query.andWhere('blog.featured = :featured', {
        featured: queryDto.featured,
      });
    }

    const isPublishedOnly =
      (isAdminOrComm || !isBlogger || queryDto.status) &&
      (queryDto.status ?? BlogStatus.PUBLISHED) === BlogStatus.PUBLISHED;

    if (isPublishedOnly) {
      query.orderBy('blog.publishedAt', 'DESC');
    } else if (queryDto.status && queryDto.status !== BlogStatus.PUBLISHED) {
      query.orderBy('blog.createdAt', 'DESC');
    } else {
      query.addSelect(
        `CASE WHEN blog.status = '${BlogStatus.PUBLISHED}' THEN blog.publishedAt ELSE blog.createdAt END`,
        'sortDate',
      );
      query.orderBy('sortDate', 'DESC');
    }

    query.skip((page - 1) * perPage).take(perPage);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, perPage };
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    user: JwtUserPayload,
  ): Promise<Blog> {
    const blog = await this.findOne(id);

    const isAdminOrComm =
      user.role === UserRole.ADMIN || user.role === UserRole.COMMUNICATION;

    if (!isAdminOrComm) {
      if (blog.authorId !== user.sub) {
        throw new ForbiddenException('You can only edit your own posts');
      }

      if (
        blog.status !== BlogStatus.DRAFT &&
        blog.status !== BlogStatus.REJECTED
      ) {
        throw new BadRequestException(
          'Only draft or rejected posts can be edited',
        );
      }
    }

    if (dto.categoryId && dto.categoryId !== blog.categoryId) {
      await this.blogCategoriesService.findOne(dto.categoryId);
    }

    if (dto.title && dto.title !== blog.title) {
      blog.slug = await this.buildUniqueSlug(dto.title, blog.id);
      blog.title = dto.title;
    }

    if (dto.content !== undefined) {
      blog.content = dto.content;
      blog.readTime = this.calculateReadTime(dto.content);
    }

    if (dto.excerpt !== undefined) {
      blog.excerpt = dto.excerpt;
    }

    if (dto.image !== undefined) {
      blog.image = dto.image;
    }

    if (dto.categoryId !== undefined) {
      blog.categoryId = dto.categoryId;
    }

    const saved = await this.blogRepository.save(blog);

    this.auditLogService.log(AuditAction.BLOG_UPDATED, user.sub, saved.id);

    return saved;
  }

  async submit(id: string, user: JwtUserPayload): Promise<Blog> {
    const blog = await this.findOne(id);

    if (blog.authorId !== user.sub) {
      throw new ForbiddenException('You can only submit your own posts');
    }

    if (
      blog.status !== BlogStatus.DRAFT &&
      blog.status !== BlogStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Only draft or rejected posts can be submitted',
      );
    }

    blog.status = BlogStatus.PENDING_REVIEW;
    blog.rejectionReason = null;

    const saved = await this.blogRepository.save(blog);

    this.auditLogService.log(AuditAction.BLOG_SUBMITTED, user.sub, saved.id);

    return saved;
  }

  async publish(id: string, performedBy: string): Promise<Blog> {
    const blog = await this.findOne(id);

    if (
      blog.status !== BlogStatus.PENDING_REVIEW &&
      blog.status !== BlogStatus.DRAFT
    ) {
      throw new BadRequestException(
        'Only draft or pending review posts can be published',
      );
    }

    blog.status = BlogStatus.PUBLISHED;
    blog.publishedAt = new Date();

    const saved = await this.blogRepository.save(blog);

    this.auditLogService.log(AuditAction.BLOG_PUBLISHED, performedBy, saved.id);

    return saved;
  }

  async reject(
    id: string,
    dto: RejectBlogDto,
    performedBy: string,
  ): Promise<Blog> {
    const blog = await this.findOne(id);

    if (blog.status !== BlogStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        'Only posts in PENDING_REVIEW can be rejected',
      );
    }

    blog.status = BlogStatus.REJECTED;
    blog.rejectionReason = dto.rejectionReason;

    const saved = await this.blogRepository.save(blog);

    this.auditLogService.log(AuditAction.BLOG_REJECTED, performedBy, saved.id);

    return saved;
  }

  async feature(id: string, performedBy: string): Promise<Blog> {
    const blog = await this.findOne(id);

    if (blog.status !== BlogStatus.PUBLISHED) {
      throw new BadRequestException('Only published posts can be featured');
    }

    if (blog.featured) {
      throw new BadRequestException('Already featured');
    }

    await this.blogRepository
      .createQueryBuilder()
      .update(Blog)
      .set({ featured: false })
      .where('featured = :featured', { featured: true })
      .execute();

    blog.featured = true;

    const saved = await this.blogRepository.save(blog);

    this.auditLogService.log(AuditAction.BLOG_FEATURED, performedBy, saved.id);

    return saved;
  }

  async unfeature(id: string, performedBy: string): Promise<Blog> {
    const blog = await this.findOne(id);

    if (!blog.featured) {
      throw new BadRequestException('Post is not featured');
    }

    blog.featured = false;

    const saved = await this.blogRepository.save(blog);

    this.auditLogService.log(
      AuditAction.BLOG_UNFEATURED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async remove(id: string, performedBy: string): Promise<{ message: string }> {
    const blog = await this.findOne(id);

    await this.uploadsService.cleanup(blog.image);
    await this.blogRepository.softDelete(blog.id);

    this.auditLogService.log(AuditAction.BLOG_DELETED, performedBy, blog.id);

    return { message: 'Blog post deleted successfully' };
  }

  private calculateReadTime(htmlContent: string): string {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private async buildUniqueSlug(title: string, excludeId?: string) {
    const baseSlug = this.generateSlug(title);
    const existing = await this.blogRepository.findOne({
      where: { slug: baseSlug },
      withDeleted: true,
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return baseSlug;
    }

    const suffix = randomUUID().slice(0, 6);
    return `${baseSlug}-${suffix}`;
  }
}
