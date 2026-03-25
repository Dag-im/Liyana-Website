import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UploadsService } from '../../uploads/uploads.service';
import { UsersService } from '../users/users.service';
import { CreateNewsEventDto } from './dto/create-news-event.dto';
import { QueryNewsEventDto } from './dto/query-news-event.dto';
import { UpdateNewsEventDto } from './dto/update-news-event.dto';
import { NewsEvent, NewsEventStatus } from './entity/news-event.entity';

type JwtUserPayload = {
  sub: string;
  role: string;
  divisionId: string | null;
};

@Injectable()
export class NewsEventsService {
  constructor(
    @InjectRepository(NewsEvent)
    private readonly newsEventsRepository: Repository<NewsEvent>,
    private readonly auditLogService: AuditLogService,
    private readonly uploadsService: UploadsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    dto: CreateNewsEventDto,
    user: JwtUserPayload,
  ): Promise<NewsEvent> {
    return this.uploadsService.withEntityUploads(
      user.sub,
      dto,
      'news-event',
      async () => {
        const creator = await this.usersService.findOne(user.sub);

        const entry = this.newsEventsRepository.create({
          type: dto.type,
          title: dto.title,
          date: new Date(dto.date),
          location: dto.location ?? null,
          summary: dto.summary,
          content: dto.content,
          keyHighlights: dto.keyHighlights ?? null,
          mainImage: dto.mainImage,
          image1: dto.image1,
          image2: dto.image2,
          status: NewsEventStatus.DRAFT,
          publishedAt: null,
          createdById: user.sub,
          createdByName: creator.name,
        });

        const saved = await this.newsEventsRepository.save(entry);

        this.auditLogService.log(
          AuditAction.NEWS_EVENT_CREATED,
          user.sub,
          saved.id,
        );

        return saved;
      },
    );
  }

  async findAll(
    queryDto: QueryNewsEventDto,
    user?: JwtUserPayload | null,
  ): Promise<{
    data: NewsEvent[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.newsEventsRepository.createQueryBuilder('entry');

    const isPrivileged =
      user?.role === 'ADMIN' || user?.role === 'COMMUNICATION';

    if (queryDto.status) {
      query.andWhere('entry.status = :status', { status: queryDto.status });
    } else if (!isPrivileged) {
      query.andWhere('entry.status = :status', {
        status: NewsEventStatus.PUBLISHED,
      });
    }

    if (queryDto.type) {
      query.andWhere('entry.type = :type', { type: queryDto.type });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('entry.title LIKE :search', { search }).orWhere(
            'entry.summary LIKE :search',
            { search },
          );
        }),
      );
    }

    if (queryDto.startDate) {
      query.andWhere('entry.date >= :startDate', {
        startDate: queryDto.startDate,
      });
    }

    if (queryDto.endDate) {
      query.andWhere('entry.date <= :endDate', { endDate: queryDto.endDate });
    }

    query
      .orderBy('entry.date', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, perPage };
  }

  async findOne(id: string): Promise<NewsEvent> {
    const entry = await this.newsEventsRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException('News & event entry not found');
    }

    return entry;
  }

  async update(
    id: string,
    dto: UpdateNewsEventDto,
    performedBy: string,
  ): Promise<NewsEvent> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'news-event',
      async () => {
        const entry = await this.findOne(id);

        const wantsToEditImages =
          dto.mainImage !== undefined ||
          dto.image1 !== undefined ||
          dto.image2 !== undefined;

        if (entry.status === NewsEventStatus.PUBLISHED && wantsToEditImages) {
          throw new BadRequestException(
            'Unpublish the entry before editing images',
          );
        }

        const previousMainImage =
          dto.mainImage && entry.mainImage && dto.mainImage !== entry.mainImage
            ? entry.mainImage
            : null;
        const previousImage1 =
          dto.image1 && entry.image1 && dto.image1 !== entry.image1
            ? entry.image1
            : null;
        const previousImage2 =
          dto.image2 && entry.image2 && dto.image2 !== entry.image2
            ? entry.image2
            : null;

        this.newsEventsRepository.merge(entry, {
          ...dto,
          ...(dto.date !== undefined ? { date: new Date(dto.date) } : {}),
          location: dto.location ?? entry.location,
          keyHighlights: dto.keyHighlights ?? entry.keyHighlights,
        });

        const saved = await this.newsEventsRepository.save(entry);

        if (previousMainImage) {
          await this.uploadsService.cleanup(previousMainImage);
        }
        if (previousImage1) {
          await this.uploadsService.cleanup(previousImage1);
        }
        if (previousImage2) {
          await this.uploadsService.cleanup(previousImage2);
        }

        this.auditLogService.log(
          AuditAction.NEWS_EVENT_UPDATED,
          performedBy,
          saved.id,
        );

        return saved;
      },
    );
  }

  async publish(id: string, performedBy: string): Promise<NewsEvent> {
    const entry = await this.findOne(id);

    if (entry.status === NewsEventStatus.PUBLISHED) {
      throw new BadRequestException('Already published');
    }

    entry.status = NewsEventStatus.PUBLISHED;
    entry.publishedAt = new Date();

    const saved = await this.newsEventsRepository.save(entry);

    this.auditLogService.log(
      AuditAction.NEWS_EVENT_PUBLISHED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async unpublish(id: string, performedBy: string): Promise<NewsEvent> {
    const entry = await this.findOne(id);

    if (entry.status === NewsEventStatus.DRAFT) {
      throw new BadRequestException('Not published');
    }

    entry.status = NewsEventStatus.DRAFT;
    entry.publishedAt = null;

    const saved = await this.newsEventsRepository.save(entry);

    this.auditLogService.log(
      AuditAction.NEWS_EVENT_UNPUBLISHED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async remove(id: string, performedBy: string): Promise<{ message: string }> {
    const entry = await this.findOne(id);

    await this.uploadsService.cleanup(entry.mainImage);
    await this.uploadsService.cleanup(entry.image1);
    await this.uploadsService.cleanup(entry.image2);

    await this.newsEventsRepository.softDelete(entry.id);

    this.auditLogService.log(
      AuditAction.NEWS_EVENT_DELETED,
      performedBy,
      entry.id,
    );

    return { message: 'News & event entry deleted successfully' };
  }
}
