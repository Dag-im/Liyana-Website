import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { MissionVision } from '../entities/mission-vision.entity';
import { UpdateMissionVisionDto } from './dto/update-mission-vision.dto';

@Injectable()
export class MissionVisionService {
  constructor(
    @InjectRepository(MissionVision)
    private readonly missionVisionRepository: Repository<MissionVision>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async find() {
    let singleton = await this.missionVisionRepository.findOne({
      where: { id: 'singleton' },
    });

    if (!singleton) {
      singleton = this.missionVisionRepository.create({
        id: 'singleton',
        missionTitle: 'Our Mission',
        missionDescription: 'Add your mission statement here.',
        missionIcon: 'Target',
        visionTitle: 'Our Vision',
        visionDescription: 'Add your vision statement here.',
        visionIcon: 'Eye',
      });

      singleton = await this.missionVisionRepository.save(singleton);
    }

    return singleton;
  }

  async update(dto: UpdateMissionVisionDto, performedBy: string) {
    const singleton = await this.find();

    Object.assign(singleton, dto);
    const saved = await this.missionVisionRepository.save(singleton);

    this.auditLogService.log(
      AuditAction.CMS_MISSION_VISION_UPDATED,
      performedBy,
      saved.id,
    );

    return saved;
  }
}
