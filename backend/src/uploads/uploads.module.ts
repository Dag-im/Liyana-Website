import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import { UploadAsset } from './entities/upload-asset.entity';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadAsset])],
  providers: [UploadsService, FileValidationPipe],
  controllers: [UploadsController],
  exports: [UploadsService, FileValidationPipe],
})
export class UploadsModule {}
