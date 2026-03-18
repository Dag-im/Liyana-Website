import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';
import { Award } from './entity/award.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Award]), CommonModule, UploadsModule],
  providers: [AwardsService],
  controllers: [AwardsController],
  exports: [AwardsService],
})
export class AwardsModule {}
