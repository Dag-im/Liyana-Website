import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../../common/common.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { BlogCategoriesController } from './blog-categories/blog-categories.controller';
import { BlogCategoriesService } from './blog-categories/blog-categories.service';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogCategory } from './entities/blog-category.entity';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogCategory, Blog]),
    CommonModule,
    UsersModule,
    UploadsModule,
    NotificationsModule,
  ],
  providers: [BlogCategoriesService, BlogsService],
  controllers: [BlogCategoriesController, BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}
