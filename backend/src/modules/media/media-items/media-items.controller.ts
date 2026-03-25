import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import multer from 'multer';

import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UploadsService } from '../../../uploads/uploads.service';
import { UserRole } from '../../../common/types/user-role.enum';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { QueryMediaItemDto } from './dto/query-media-item.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { MediaItemsService } from './media-items.service';

@ApiTags('Media Items')
@Controller('media-folders/:folderId/items')
export class MediaItemsController {
  constructor(
    private readonly itemsService: MediaItemsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload media item file (image)' })
  async uploadFile(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<any> {
    await new Promise<void>((resolve, reject) => {
      multer(this.uploadsService.buildMulterOptions()).single('file')(
        req,
        res,
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });

    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.uploadsService.createTempUpload(file.filename, req.user.sub);
  }

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get items in a folder (public)' })
  findAll(
    @Param('folderId') folderId: string,
    @Query() query: QueryMediaItemDto,
  ) {
    return this.itemsService.findAll(folderId, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Create media item',
    description:
      'Type is auto-detected from URL (YouTube -> video, else image)',
  })
  create(
    @Param('folderId') folderId: string,
    @Body() dto: CreateMediaItemDto,
    @Req() req: any,
  ) {
    return this.itemsService.create(folderId, dto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  update(
    @Param('folderId') folderId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMediaItemDto,
    @Req() req: any,
  ) {
    return this.itemsService.update(folderId, id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  remove(
    @Param('folderId') folderId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.itemsService.remove(folderId, id, req.user.sub);
  }
}
