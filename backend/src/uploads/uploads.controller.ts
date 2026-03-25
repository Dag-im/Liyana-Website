import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Get(':filename')
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const uploadPath = this.configService.getOrThrow<string>('app.upload.path');
    const filePath = join(uploadPath, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return res.sendFile(filePath);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a temporary upload owned by the current user' })
  removeTempUpload(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.uploadsService.deleteTempUpload(id, req.user.sub);
  }
}
