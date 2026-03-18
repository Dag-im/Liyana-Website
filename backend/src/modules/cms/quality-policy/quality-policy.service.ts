import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { QualityPolicy } from '../entities/quality-policy.entity';
import { UpsertQualityPolicyDto } from './dto/upsert-quality-policy.dto';

@Injectable()
export class QualityPolicyService {
  constructor(
    @InjectRepository(QualityPolicy)
    private readonly qualityPolicyRepository: Repository<QualityPolicy>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll() {
    return this.qualityPolicyRepository.find({
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async upsert(lang: string, dto: UpsertQualityPolicyDto, performedBy: string) {
    let qualityPolicy = await this.qualityPolicyRepository.findOne({
      where: { lang },
    });

    if (!qualityPolicy) {
      qualityPolicy = this.qualityPolicyRepository.create({
        lang,
        goals: dto.goals,
        sortOrder: dto.sortOrder ?? 0,
      });
    } else {
      qualityPolicy.goals = dto.goals;
      if (dto.sortOrder !== undefined) {
        qualityPolicy.sortOrder = dto.sortOrder;
      }
    }

    const saved = await this.qualityPolicyRepository.save(qualityPolicy);

    this.auditLogService.log(
      AuditAction.CMS_QUALITY_POLICY_UPDATED,
      performedBy,
      saved.id,
      { lang: saved.lang },
    );

    return saved;
  }

  async remove(lang: string, performedBy: string) {
    const qualityPolicy = await this.qualityPolicyRepository.findOne({
      where: { lang },
    });

    if (!qualityPolicy) {
      throw new NotFoundException(`Quality policy for ${lang} not found`);
    }

    await this.qualityPolicyRepository.delete({ lang });

    this.auditLogService.log(
      AuditAction.CMS_QUALITY_POLICY_DELETED,
      performedBy,
      qualityPolicy.id,
      { lang: qualityPolicy.lang },
    );

    return { message: 'Quality policy deleted successfully' };
  }
}
