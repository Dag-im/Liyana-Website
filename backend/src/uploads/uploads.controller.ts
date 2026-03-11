// in uploads.controller.ts
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':filename')
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const uploadPath = this.configService.getOrThrow<string>('app.upload.path');
    const filePath = join(uploadPath, filename);

    console.log('UPLOAD PATH:', uploadPath);
    console.log('FULL FILE PATH:', filePath);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return res.sendFile(filePath);
  }
}
