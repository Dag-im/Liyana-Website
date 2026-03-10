import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { DivisionCategory } from '../entities/division-category.entity';
import { Division } from '../entities/division.entity';
import { CreateDivisionCategoryDto } from './dto/create-division-category.dto';
import { UpdateDivisionCategoryDto } from './dto/update-division-category.dto';

@Injectable()
export class DivisionCategoriesService {
  constructor(
    @InjectRepository(DivisionCategory)
    private readonly categoryRepository: Repository<DivisionCategory>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll(): Promise<DivisionCategory[]> {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<DivisionCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Division category not found');
    }
    return category;
  }

  async create(
    createDto: CreateDivisionCategoryDto,
    performedBy: string,
  ): Promise<DivisionCategory> {
    const existing = await this.categoryRepository.findOne({
      where: { name: createDto.name },
    });
    if (existing) {
      throw new ConflictException('Division category name already exists');
    }

    const category = this.categoryRepository.create(createDto);
    const saved = await this.categoryRepository.save(category);

    this.auditLogService.log(
      AuditAction.DIVISION_CATEGORY_CREATED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async update(
    id: string,
    updateDto: UpdateDivisionCategoryDto,
    performedBy: string,
  ): Promise<DivisionCategory> {
    const category = await this.findOne(id);

    if (updateDto.name && updateDto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: { name: updateDto.name },
      });
      if (existing) {
        throw new ConflictException('Division category name already exists');
      }
    }

    const updated = this.categoryRepository.merge(category, updateDto);
    const saved = await this.categoryRepository.save(updated);

    this.auditLogService.log(
      AuditAction.DIVISION_CATEGORY_UPDATED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async remove(id: string, performedBy: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Division category not found');
    }

    const divisionsCount = await this.categoryRepository.manager.count(
      Division,
      {
        where: { divisionCategoryId: id },
      },
    );

    if (divisionsCount > 0) {
      throw new ConflictException(
        'Cannot delete a category that has divisions assigned to it',
      );
    }

    await this.categoryRepository.delete(id);

    this.auditLogService.log(
      AuditAction.DIVISION_CATEGORY_DELETED,
      performedBy,
      id,
    );

    return { message: 'Division category deleted successfully' };
  }
}
