import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NetworkEntity } from '../entities/network-entity.entity';

@Injectable()
export class NetworkMetaService {
  constructor(
    @InjectRepository(NetworkEntity)
    private readonly entityRepo: Repository<NetworkEntity>,
  ) {}

  async getMeta() {
    const totalEntities = await this.entityRepo.count({
      where: { deletedAt: IsNull() },
    });
    const latest = await this.entityRepo.findOne({
      where: { deletedAt: IsNull() },
      order: { updatedAt: 'DESC' },
      select: ['updatedAt'],
    });
    return {
      totalEntities,
      lastUpdated: latest?.updatedAt ?? null,
      version: `Core.v.${new Date().getFullYear()}`,
    };
  }
}
