import { Module } from '@nestjs/common';

import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  providers: [UploadsService, FileValidationPipe],
  controllers: [UploadsController],
  exports: [UploadsService, FileValidationPipe],
})
export class UploadsModule {}
