import { Module } from '@nestjs/common';

import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import { UploadsService } from './uploads.service';

@Module({
  providers: [UploadsService, FileValidationPipe],
  exports: [UploadsService, FileValidationPipe],
})
export class UploadsModule {}
