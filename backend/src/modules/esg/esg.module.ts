import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { EsgController } from './esg.controller';
import { EsgService } from './esg.service';
import { EsgGovernanceItem } from './entities/esg-governance-item.entity';
import { EsgHero } from './entities/esg-hero.entity';
import { EsgLucsBridge } from './entities/esg-lucs-bridge.entity';
import { EsgMetric } from './entities/esg-metric.entity';
import { EsgPillarInitiative } from './entities/esg-pillar-initiative.entity';
import { EsgPillar } from './entities/esg-pillar.entity';
import { EsgReport } from './entities/esg-report.entity';
import { EsgStrategy } from './entities/esg-strategy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EsgHero,
      EsgStrategy,
      EsgLucsBridge,
      EsgPillar,
      EsgPillarInitiative,
      EsgMetric,
      EsgGovernanceItem,
      EsgReport,
    ]),
    CommonModule,
    UploadsModule,
  ],
  providers: [EsgService],
  controllers: [EsgController],
  exports: [EsgService],
})
export class EsgModule {}
