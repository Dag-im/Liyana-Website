import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { CmsController } from './cms.controller';
import { CoreValuesService } from './core-values/core-values.service';
import { CoreValue } from './entities/core-value.entity';
import { MissionVision } from './entities/mission-vision.entity';
import { QualityPolicy } from './entities/quality-policy.entity';
import { Stat } from './entities/stat.entity';
import { WhoWeAre } from './entities/who-we-are.entity';
import { MissionVisionService } from './mission-vision/mission-vision.service';
import { QualityPolicyService } from './quality-policy/quality-policy.service';
import { StatsService } from './stats/stats.service';
import { WhoWeAreService } from './who-we-are/who-we-are.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MissionVision,
      WhoWeAre,
      CoreValue,
      Stat,
      QualityPolicy,
    ]),
    CommonModule,
  ],
  providers: [
    MissionVisionService,
    WhoWeAreService,
    CoreValuesService,
    StatsService,
    QualityPolicyService,
  ],
  controllers: [CmsController],
  exports: [
    MissionVisionService,
    WhoWeAreService,
    CoreValuesService,
    StatsService,
    QualityPolicyService,
  ],
})
export class CmsModule {}
