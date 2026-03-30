import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LucsController } from './lucs.controller';
import { LucsService } from './lucs.service';
import { LucsBulletPoint } from './entities/lucs-bullet-point.entity';
import { LucsCta } from './entities/lucs-cta.entity';
import { LucsHero } from './entities/lucs-hero.entity';
import { LucsInquiry } from './entities/lucs-inquiry.entity';
import { LucsMission } from './entities/lucs-mission.entity';
import { LucsPillarIntro } from './entities/lucs-pillar-intro.entity';
import { LucsPillar } from './entities/lucs-pillar.entity';
import { LucsWhoWeAre } from './entities/lucs-who-we-are.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LucsHero,
      LucsWhoWeAre,
      LucsMission,
      LucsPillarIntro,
      LucsPillar,
      LucsBulletPoint,
      LucsCta,
      LucsInquiry,
    ]),
    CommonModule,
    UploadsModule,
    NotificationsModule,
  ],
  providers: [LucsService],
  controllers: [LucsController],
  exports: [LucsService],
})
export class LucsModule {}
