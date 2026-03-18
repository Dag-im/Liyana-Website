import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { TimelineItem } from './entity/timeline-item.entity';
import { TimelineController } from './timeline.controller';
import { TimelineService } from './timeline.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimelineItem]),
    CommonModule,
    UploadsModule,
  ],
  providers: [TimelineService],
  controllers: [TimelineController],
  exports: [TimelineService],
})
export class TimelineModule {}
