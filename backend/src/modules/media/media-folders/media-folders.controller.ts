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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import multer from 'multer';

import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../common/types/user-role.enum';
import { UploadsService } from '../../../uploads/uploads.service';
import { MediaFoldersService } from './media-folders.service';
import { CreateMediaFolderDto } from './dto/create-media-folder.dto';
import { UpdateMediaFolderDto } from './dto/update-media-folder.dto';
import { QueryMediaFolderDto } from './dto/query-media-folder.dto';

@ApiTags('Media Folders')
@Controller('media-folders')
export class MediaFoldersController {
  constructor(
    private readonly foldersService: MediaFoldersService,
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
  @ApiOperation({ summary: 'Upload cover image' })
  async uploadFile(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ path: string }> {
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

    return { path: file.filename };
  }

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all media folders (public)' })
  findAll(@Query() query: QueryMediaFolderDto) {
    return this.foldersService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ 
    summary: 'Get media folder by id (public)',
    description: 'Includes items and computed fields: mediaCount and lastUpdated' 
  })
  findOne(@Param('id') id: string) {
    return this.foldersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  create(@Body() dto: CreateMediaFolderDto, @Req() req: any) {
    return this.foldersService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaFolderDto,
    @Req() req: any,
  ) {
    return this.foldersService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ 
    summary: 'Delete media folder',
    description: 'Soft deletes the folder and all items. Permanently deletes associated image files from disk.' 
  })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.foldersService.remove(id, req.user.sub);
  }
}
