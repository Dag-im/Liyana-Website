import {
  BadRequestException,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { readFile } from 'node:fs/promises';
import { UploadsService } from '../../uploads/uploads.service';

@Injectable({ scope: Scope.REQUEST })
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly uploadsService: UploadsService) {}

  async transform(
    value: Express.Multer.File | Express.Multer.File[] | undefined,
  ) {
    if (!value) return value;

    const files = Array.isArray(value) ? value : [value];

    for (const file of files) {
      if (file.path) {
        await this.validateFile(file);
      }
    }

    return value;
  }

  private async validateFile(file: Express.Multer.File) {
    const buffer = await readFile(file.path);
    const type = await fromBuffer(buffer);

    if (!type || type.mime !== file.mimetype) {
      await this.uploadsService.cleanup(file.path);
      throw new BadRequestException([
        {
          field: file.fieldname,
          error: 'INVALID_FILE_TYPE',
        },
      ]);
    }
  }
}
