import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { CoreValue } from '../entities/core-value.entity';
import { CreateCoreValueDto } from './dto/create-core-value.dto';
import { UpdateCoreValueDto } from './dto/update-core-value.dto';

@Injectable()
export class CoreValuesService {
  constructor(
    @InjectRepository(CoreValue)
    private readonly coreValueRepository: Repository<CoreValue>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll() {
    return this.coreValueRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async create(dto: CreateCoreValueDto, performedBy: string) {
    const coreValue = this.coreValueRepository.create(dto);
    const saved = await this.coreValueRepository.save(coreValue);

    this.auditLogService.log(
      AuditAction.CMS_CORE_VALUE_CREATED,
      performedBy,
      saved.id,
      { title: saved.title },
    );

    return saved;
  }

  async update(id: string, dto: UpdateCoreValueDto, performedBy: string) {
    const coreValue = await this.findOne(id);

    Object.assign(coreValue, dto);
    const saved = await this.coreValueRepository.save(coreValue);

    this.auditLogService.log(
      AuditAction.CMS_CORE_VALUE_UPDATED,
      performedBy,
      saved.id,
      { title: saved.title },
    );

    return saved;
  }

  async remove(id: string, performedBy: string) {
    const coreValue = await this.findOne(id);
    await this.coreValueRepository.delete(id);

    this.auditLogService.log(
      AuditAction.CMS_CORE_VALUE_DELETED,
      performedBy,
      id,
      { title: coreValue.title },
    );

    return { message: 'Core value deleted successfully' };
  }

  private async findOne(id: string) {
    const coreValue = await this.coreValueRepository.findOne({ where: { id } });
    if (!coreValue) {
      throw new NotFoundException(`Core value with ID ${id} not found`);
    }

    return coreValue;
  }
}
