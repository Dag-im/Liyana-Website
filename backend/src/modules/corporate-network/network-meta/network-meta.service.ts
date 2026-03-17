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
    // We use Query Builder here because the NetworkEntity has an eager relation
    // with NetworkRelation. Using repository.findOne with 'order' or 'select'
    // often triggers eager loading which can cause 500 errors in certain 
    // serialization interceptors if they hit circular references or partial data.
    
    const totalEntities = await this.entityRepo.count();

    const latestResult = await this.entityRepo
      .createQueryBuilder('entity')
      .select('MAX(entity.updatedAt)', 'latestUpdate')
      .getRawOne();

    return {
      totalEntities,
      lastUpdated: latestResult?.latestUpdate ?? null,
      version: `Core.v.${new Date().getFullYear()}`,
    };
  }
}
