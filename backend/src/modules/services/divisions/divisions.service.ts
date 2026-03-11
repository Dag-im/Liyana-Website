import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { UploadsService } from '../../../uploads/uploads.service';
import { User } from '../../users/entity/user.entity';
import { DivisionCategoriesService } from '../division-categories/division-categories.service';
import { DivisionContact } from '../entities/division-contact.entity';
import { DivisionCoreService } from '../entities/division-core-service.entity';
import { DivisionImage } from '../entities/division-image.entity';
import { DivisionStat } from '../entities/division-stat.entity';
import { Division } from '../entities/division.entity';
import { Doctor } from '../entities/doctor.entity';
import { ServiceCategoriesService } from '../service-categories/service-categories.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { QueryDivisionDto } from './dto/query-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    private readonly dataSource: DataSource,
    private readonly serviceCategoriesService: ServiceCategoriesService,
    private readonly divisionCategoriesService: DivisionCategoriesService,
    private readonly auditLogService: AuditLogService,
    private readonly uploadsService: UploadsService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(queryDto: QueryDivisionDto): Promise<{
    data: Division[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.divisionRepository
      .createQueryBuilder('division')
      .leftJoinAndSelect('division.divisionCategory', 'divisionCategory');

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('division.name LIKE :search', { search }).orWhere(
            'division.shortName LIKE :search',
            { search },
          );
        }),
      );
    }

    if (queryDto.serviceCategoryId) {
      query.andWhere('division.serviceCategoryId = :sc', {
        sc: queryDto.serviceCategoryId,
      });
    }

    if (queryDto.divisionCategoryId) {
      query.andWhere('division.divisionCategoryId = :dc', {
        dc: queryDto.divisionCategoryId,
      });
    }

    if (queryDto.isActive !== undefined) {
      query.andWhere('division.isActive = :isActive', {
        isActive: queryDto.isActive,
      });
    }

    query.skip((page - 1) * perPage).take(perPage);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, perPage };
  }

  async findOne(id: string): Promise<Division> {
    const division = await this.divisionRepository.findOne({
      where: { id },
      relations: [
        'divisionCategory',
        'serviceCategory',
        'images',
        'coreServices',
        'stats',
        'doctors',
        'contact',
      ],
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    return division;
  }

  async findDoctors(divisionId: string): Promise<Doctor[]> {
    const division = await this.findOne(divisionId);
    return division.doctors || [];
  }

  async create(
    createDto: CreateDivisionDto,
    performedBy: string,
  ): Promise<Division> {
    await this.serviceCategoriesService.findOne(createDto.serviceCategoryId);
    await this.divisionCategoriesService.findOne(createDto.divisionCategoryId);

    const existingSlug = await this.divisionRepository.findOne({
      where: { slug: createDto.slug },
      withDeleted: true,
    });
    if (existingSlug) {
      throw new ConflictException('Slug already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const division = queryRunner.manager.create(Division, {
        slug: createDto.slug,
        name: createDto.name,
        shortName: createDto.shortName,
        location: createDto.location,
        overview: createDto.overview,
        logo: createDto.logo,
        description: createDto.description,
        groupPhoto: createDto.groupPhoto,
        isActive: createDto.isActive ?? true,
        serviceCategoryId: createDto.serviceCategoryId,
        divisionCategoryId: createDto.divisionCategoryId,
      });

      const savedDivision = await queryRunner.manager.save(division);

      if (createDto.images?.length) {
        const imageEntities = createDto.images.map((img, index) =>
          queryRunner.manager.create(DivisionImage, {
            path: img.path,
            sortOrder: index,
            divisionId: savedDivision.id,
          }),
        );
        await queryRunner.manager.save(imageEntities);
      }

      if (createDto.coreServices?.length) {
        const coreServicesEntities = createDto.coreServices.map((service, index) =>
          queryRunner.manager.create(DivisionCoreService, {
            name: service.name,
            description: service.description,
            sortOrder: index,
            divisionId: savedDivision.id,
          }),
        );
        await queryRunner.manager.save(coreServicesEntities);
      }

      if (createDto.stats?.length) {
        const statEntities = createDto.stats.map((stat, index) =>
          queryRunner.manager.create(DivisionStat, {
            ...stat,
            sortOrder: stat.sortOrder ?? index,
            divisionId: savedDivision.id,
          }),
        );
        await queryRunner.manager.save(statEntities);
      }

      if (createDto.doctors?.length) {
        const doctorEntities = createDto.doctors.map((doc) =>
          queryRunner.manager.create(Doctor, {
            ...doc,
            availability: doc.availability || 'Available during business hours',
            divisionId: savedDivision.id,
          }),
        );
        await queryRunner.manager.save(doctorEntities);
      }

      if (createDto.contact) {
        const contactEntity = queryRunner.manager.create(DivisionContact, {
          ...createDto.contact,
          divisionId: savedDivision.id,
        });
        await queryRunner.manager.save(contactEntity);
      }

      await queryRunner.commitTransaction();

      this.auditLogService.log(
        AuditAction.DIVISION_CREATED,
        performedBy,
        savedDivision.id,
      );

      return this.findOne(savedDivision.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateDto: UpdateDivisionDto,
    performedBy: string,
  ): Promise<Division> {
    const division = await this.findOne(id);

    if (updateDto.serviceCategoryId) {
      await this.serviceCategoriesService.findOne(updateDto.serviceCategoryId);
    }

    if (updateDto.divisionCategoryId) {
      await this.divisionCategoriesService.findOne(
        updateDto.divisionCategoryId,
      );
    }

    if (updateDto.slug && updateDto.slug !== division.slug) {
      const existingSlug = await this.divisionRepository.findOne({
        where: { slug: updateDto.slug },
        withDeleted: true,
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('Slug already exists');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Merge base division fields
      queryRunner.manager.merge(Division, division, {
        slug: updateDto.slug,
        name: updateDto.name,
        shortName: updateDto.shortName,
        location: updateDto.location,
        overview: updateDto.overview,
        logo: updateDto.logo,
        description: updateDto.description,
        groupPhoto: updateDto.groupPhoto,
        isActive: updateDto.isActive,
        serviceCategoryId: updateDto.serviceCategoryId,
        divisionCategoryId: updateDto.divisionCategoryId,
      });

      if (updateDto.logo && division.logo && updateDto.logo !== division.logo) {
        await this.uploadsService.cleanup(division.logo);
      }

      if (
        updateDto.groupPhoto &&
        division.groupPhoto &&
        updateDto.groupPhoto !== division.groupPhoto
      ) {
        await this.uploadsService.cleanup(division.groupPhoto);
      }

      const updatedDivision = await queryRunner.manager.save(division);

      if (updateDto.images !== undefined) {
        const oldImages = await queryRunner.manager.find(DivisionImage, {
          where: { divisionId: id },
        });

        await queryRunner.manager.delete(DivisionImage, { divisionId: id });

        if (updateDto.images && updateDto.images.length > 0) {
          const imageEntities = updateDto.images.map((img, index) =>
            queryRunner.manager.create(DivisionImage, {
              path: img.path,
              sortOrder: index,
              divisionId: id,
            }),
          );
          await queryRunner.manager.save(imageEntities);
        }

        // Cleanup files for deleted images
        const currentImagePaths = updateDto.images?.map(img => img.path) || [];
        for (const oldImage of oldImages) {
          if (!currentImagePaths.includes(oldImage.path)) {
            await this.uploadsService.cleanup(oldImage.path);
          }
        }
      }

      if (updateDto.coreServices !== undefined) {
        await queryRunner.manager.delete(DivisionCoreService, {
          divisionId: id,
        });
        if (updateDto.coreServices && updateDto.coreServices.length > 0) {
          const coreServicesEntities = updateDto.coreServices.map(
            (service, index) =>
              queryRunner.manager.create(DivisionCoreService, {
                name: service.name,
                description: service.description,
                sortOrder: index,
                divisionId: id,
              }),
          );
          await queryRunner.manager.save(coreServicesEntities);
        }
      }

      if (updateDto.stats !== undefined) {
        await queryRunner.manager.delete(DivisionStat, { divisionId: id });
        if (updateDto.stats && updateDto.stats.length > 0) {
          const statEntities = updateDto.stats.map((stat, index) =>
            queryRunner.manager.create(DivisionStat, {
              ...stat,
              sortOrder: stat.sortOrder ?? index,
              divisionId: id,
            }),
          );
          await queryRunner.manager.save(statEntities);
        }
      }

      if (updateDto.contact !== undefined) {
        if (updateDto.contact === null) {
          await queryRunner.manager.delete(DivisionContact, { divisionId: id });
        } else {
          const existingContact = await queryRunner.manager.findOne(
            DivisionContact,
            { where: { divisionId: id } },
          );
          if (existingContact) {
            queryRunner.manager.merge(
              DivisionContact,
              existingContact,
              updateDto.contact,
            );
            await queryRunner.manager.save(existingContact);
          } else {
            const contactEntity = queryRunner.manager.create(DivisionContact, {
              ...updateDto.contact,
              divisionId: id,
            });
            await queryRunner.manager.save(contactEntity);
          }
        }
      }

      await queryRunner.commitTransaction();

      this.auditLogService.log(
        AuditAction.DIVISION_UPDATED,
        performedBy,
        updatedDivision.id,
      );

      return this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, performedBy: string): Promise<{ message: string }> {
    const division = await this.findOne(id);

    if (division.logo) {
      await this.uploadsService.cleanup(division.logo);
    }

    if (division.groupPhoto) {
      await this.uploadsService.cleanup(division.groupPhoto);
    }

    if (division.images && division.images.length > 0) {
      for (const img of division.images) {
        await this.uploadsService.cleanup(img.path);
      }
    }

    division.isActive = false;
    await this.divisionRepository.save(division);

    // Nullify divisionId for all users assigned to this division
    await this.usersRepository.update({ divisionId: id }, { divisionId: null });

    await this.divisionRepository.softDelete(id);

    this.auditLogService.log(AuditAction.DIVISION_DELETED, performedBy, id);

    return { message: 'Division deleted successfully' };
  }
}
