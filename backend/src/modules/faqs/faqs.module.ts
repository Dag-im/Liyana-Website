import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { FaqCategory } from './entities/faq-category.entity';
import { Faq } from './entities/faq.entity';
import { FaqCategoriesController } from './faq-categories/faq-categories.controller';
import { FaqCategoriesService } from './faq-categories/faq-categories.service';
import { FaqsController } from './faqs/faqs.controller';
import { FaqsService } from './faqs/faqs.service';

@Module({
  imports: [TypeOrmModule.forFeature([FaqCategory, Faq]), CommonModule],
  providers: [FaqCategoriesService, FaqsService],
  controllers: [FaqCategoriesController, FaqsController],
  exports: [FaqCategoriesService, FaqsService],
})
export class FaqsModule {}
