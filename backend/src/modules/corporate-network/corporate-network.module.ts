import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { NetworkEntity } from './entities/network-entity.entity';
import { NetworkRelation } from './entities/network-relation.entity';
import { NetworkEntitiesController } from './network-entities/network-entities.controller';
import { NetworkEntitiesService } from './network-entities/network-entities.service';
import { NetworkMetaController } from './network-meta/network-meta.controller';
import { NetworkMetaService } from './network-meta/network-meta.service';
import { NetworkRelationsController } from './network-relations/network-relations.controller';
import { NetworkRelationsService } from './network-relations/network-relations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NetworkRelation, NetworkEntity]),
    CommonModule,
  ],
  providers: [
    NetworkRelationsService,
    NetworkEntitiesService,
    NetworkMetaService,
  ],
  controllers: [
    NetworkRelationsController,
    NetworkEntitiesController,
    NetworkMetaController,
  ],
  exports: [NetworkEntitiesService, NetworkRelationsService],
})
export class CorporateNetworkModule {}
