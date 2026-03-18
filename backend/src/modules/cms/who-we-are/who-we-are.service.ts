import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { WhoWeAre } from '../entities/who-we-are.entity';
import { UpdateWhoWeAreDto } from './dto/update-who-we-are.dto';

@Injectable()
export class WhoWeAreService {
  constructor(
    @InjectRepository(WhoWeAre)
    private readonly whoWeAreRepository: Repository<WhoWeAre>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async find() {
    let singleton = await this.whoWeAreRepository.findOne({
      where: { id: 'singleton' },
    });

    if (!singleton) {
      singleton = this.whoWeAreRepository.create({
        id: 'singleton',
        content: 'Add your Who We Are content here.',
      });

      singleton = await this.whoWeAreRepository.save(singleton);
    }

    return singleton;
  }

  async update(dto: UpdateWhoWeAreDto, performedBy: string) {
    const singleton = await this.find();

    singleton.content = dto.content;
    const saved = await this.whoWeAreRepository.save(singleton);

    this.auditLogService.log(
      AuditAction.CMS_WHO_WE_ARE_UPDATED,
      performedBy,
      saved.id,
    );

    return saved;
  }
}
