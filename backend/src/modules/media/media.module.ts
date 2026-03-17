import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaTag } from './entities/media-tag.entity';
import { MediaFolder } from './entities/media-folder.entity';
import { MediaItem } from './entities/media-item.entity';
import { MediaTagsService } from './media-tags/media-tags.service';
import { MediaTagsController } from './media-tags/media-tags.controller';
import { MediaFoldersService } from './media-folders/media-folders.service';
import { MediaFoldersController } from './media-folders/media-folders.controller';
import { MediaItemsService } from './media-items/media-items.service';
import { MediaItemsController } from './media-items/media-items.controller';
import { CommonModule } from '../../common/common.module';
import { UploadsModule } from '../../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaTag, MediaFolder, MediaItem]),
    CommonModule,
    UploadsModule,
  ],
  providers: [MediaTagsService, MediaFoldersService, MediaItemsService],
  controllers: [
    MediaTagsController,
    MediaFoldersController,
    MediaItemsController,
  ],
  exports: [MediaFoldersService, MediaItemsService],
})
export class MediaModule {}
