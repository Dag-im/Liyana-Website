import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { Stat } from '../entities/stat.entity';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll() {
    return this.statRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async create(dto: CreateStatDto, performedBy: string) {
    const stat = this.statRepository.create(dto);
    const saved = await this.statRepository.save(stat);

    this.auditLogService.log(
      AuditAction.CMS_STAT_CREATED,
      performedBy,
      saved.id,
      { label: saved.label },
    );

    return saved;
  }

  async update(id: string, dto: UpdateStatDto, performedBy: string) {
    const stat = await this.findOne(id);

    Object.assign(stat, dto);
    const saved = await this.statRepository.save(stat);

    this.auditLogService.log(
      AuditAction.CMS_STAT_UPDATED,
      performedBy,
      saved.id,
      { label: saved.label },
    );

    return saved;
  }

  async remove(id: string, performedBy: string) {
    const stat = await this.findOne(id);
    await this.statRepository.delete(id);

    this.auditLogService.log(
      AuditAction.CMS_STAT_DELETED,
      performedBy,
      id,
      { label: stat.label },
    );

    return { message: 'Stat deleted successfully' };
  }

  private async findOne(id: string) {
    const stat = await this.statRepository.findOne({ where: { id } });
    if (!stat) {
      throw new NotFoundException(`Stat with ID ${id} not found`);
    }

    return stat;
  }
}
