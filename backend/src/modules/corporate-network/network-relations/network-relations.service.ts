import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { NetworkRelation } from '../entities/network-relation.entity';
import { NetworkEntity } from '../entities/network-entity.entity';
import { CreateNetworkRelationDto } from './dto/create-network-relation.dto';
import { UpdateNetworkRelationDto } from './dto/update-network-relation.dto';

@Injectable()
export class NetworkRelationsService {
  constructor(
    @InjectRepository(NetworkRelation)
    private readonly relationRepo: Repository<NetworkRelation>,
    @InjectRepository(NetworkEntity)
    private readonly entityRepo: Repository<NetworkEntity>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll(): Promise<NetworkRelation[]> {
    return this.relationRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<NetworkRelation> {
    const relation = await this.relationRepo.findOne({ where: { id } });
    if (!relation) {
      throw new NotFoundException(`Network relation with ID ${id} not found`);
    }
    return relation;
  }

  async create(
    dto: CreateNetworkRelationDto,
    performedBy: string,
  ): Promise<NetworkRelation> {
    const existing = await this.relationRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Network relation with name "${dto.name}" already exists`,
      );
    }

    const relation = this.relationRepo.create(dto);
    const saved = await this.relationRepo.save(relation);

    this.auditLogService.log(
      AuditAction.NETWORK_RELATION_CREATED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async update(
    id: string,
    dto: UpdateNetworkRelationDto,
    performedBy: string,
  ): Promise<NetworkRelation> {
    const relation = await this.findOne(id);

    if (dto.name && dto.name !== relation.name) {
      const existing = await this.relationRepo.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Network relation with name "${dto.name}" already exists`,
        );
      }
    }

    Object.assign(relation, dto);
    const updated = await this.relationRepo.save(relation);

    this.auditLogService.log(
      AuditAction.NETWORK_RELATION_UPDATED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async remove(id: string, performedBy: string): Promise<void> {
    await this.findOne(id);

    const entityCount = await this.entityRepo.count({
      where: { relationId: id },
    });
    if (entityCount > 0) {
      throw new ConflictException(
        'Cannot delete a relation type that has entities assigned to it',
      );
    }

    await this.relationRepo.delete(id);

    this.auditLogService.log(
      AuditAction.NETWORK_RELATION_DELETED,
      performedBy,
      id,
    );
  }
}
