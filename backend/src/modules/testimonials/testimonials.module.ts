import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Testimonial } from './entity/testimonial.entity';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Testimonial]),
    CommonModule,
    NotificationsModule,
  ],
  providers: [TestimonialsService],
  controllers: [TestimonialsController],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
