import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadsModule } from 'src/uploads/uploads.module';
import { CommonModule } from '../../common/common.module';
import { UsersModule } from '../users/users.module';
import { NewsEvent } from './entity/news-event.entity';
import { NewsEventsController } from './news-events.controller';
import { NewsEventsService } from './news-events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsEvent]),
    CommonModule,
    UsersModule,
    UploadsModule,
  ],
  providers: [NewsEventsService],
  controllers: [NewsEventsController],
  exports: [NewsEventsService],
})
export class NewsEventsModule {}
