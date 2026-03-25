import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { UploadsService } from '../../../uploads/uploads.service';
import { Division } from '../entities/division.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { QueryServiceCategoryDto } from './dto/query-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly categoryRepository: Repository<ServiceCategory>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    private readonly auditLogService: AuditLogService,
    private readonly uploadsService: UploadsService,
  ) {}

  async findAll(queryDto: QueryServiceCategoryDto): Promise<{
    data: ServiceCategory[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.categoryRepository.createQueryBuilder('category');

    // Include a relation count so the admin UI can display
    // the number of divisions per service category without
    // needing to load full division relations for the list view.
    query.loadRelationCountAndMap(
      'category.divisionsCount',
      'category.divisions',
    );

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('category.title LIKE :search', { search }).orWhere(
            'category.tagline LIKE :search',
            { search },
          );
        }),
      );
    }

    query
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.createdAt', 'DESC');
    query.skip((page - 1) * perPage).take(perPage);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: string): Promise<ServiceCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: [
        'divisions',
        'divisions.divisionCategory',
        'divisions.images',
        'divisions.coreServices',
        'divisions.stats',
        'divisions.doctors',
        'divisions.contact',
      ],
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    return category;
  }

  async create(
    createDto: CreateServiceCategoryDto,
    performedBy: string,
  ): Promise<ServiceCategory> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      createDto,
      'service-category',
      async () => {
        let sortOrder = createDto.sortOrder;

        if (sortOrder === undefined) {
          const lastCategory = await this.categoryRepository
            .createQueryBuilder('category')
            .orderBy('category.sortOrder', 'DESC')
            .addOrderBy('category.createdAt', 'DESC')
            .getOne();
          sortOrder = (lastCategory?.sortOrder ?? -1) + 1;
        }

        const category = this.categoryRepository.create({
          ...createDto,
          sortOrder,
        });
        const saved = await this.categoryRepository.save(category);

        this.auditLogService.log(
          AuditAction.SERVICE_CATEGORY_CREATED,
          performedBy,
          saved.id,
        );

        return saved;
      },
    );
  }

  async update(
    id: string,
    updateDto: UpdateServiceCategoryDto,
    performedBy: string,
  ): Promise<ServiceCategory> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      updateDto,
      'service-category',
      async () => {
        const category = await this.findOne(id);
        const previousHeroImage =
          updateDto.heroImage &&
          category.heroImage &&
          updateDto.heroImage !== category.heroImage
            ? category.heroImage
            : null;

        this.categoryRepository.merge(category, updateDto);
        const saved = await this.categoryRepository.save(category);

        if (previousHeroImage) {
          await this.uploadsService.cleanup(previousHeroImage);
        }

        this.auditLogService.log(
          AuditAction.SERVICE_CATEGORY_UPDATED,
          performedBy,
          saved.id,
        );

        return saved;
      },
    );
  }

  async remove(id: string, performedBy: string): Promise<{ message: string }> {
    const category = await this.findOne(id);

    if (category.heroImage) {
      await this.uploadsService.cleanup(category.heroImage);
    }

    await this.categoryRepository.softDelete(category.id);

    this.auditLogService.log(
      AuditAction.SERVICE_CATEGORY_DELETED,
      performedBy,
      category.id,
    );

    return { message: 'Service category deleted successfully' };
  }

  async findDivisions(serviceCategoryId: string): Promise<Division[]> {
    await this.findOne(serviceCategoryId);

    return this.divisionRepository.find({
      where: { serviceCategoryId, isActive: true },
      relations: [
        'divisionCategory',
        'serviceCategory',
        'images',
        'coreServices',
        'stats',
        'doctors',
        'contact',
      ],
      order: {
        name: 'ASC',
      },
    });
  }
}
