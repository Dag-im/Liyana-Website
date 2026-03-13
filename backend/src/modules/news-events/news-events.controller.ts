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

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { ApiEnvelope } from '../../common/types/api-envelope.type';
import { UserRole } from '../../common/types/user-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { CreateNewsEventDto } from './dto/create-news-event.dto';
import { QueryNewsEventDto } from './dto/query-news-event.dto';
import { UpdateNewsEventDto } from './dto/update-news-event.dto';
import { NewsEventsService } from './news-events.service';

type AuthenticatedRequest = {
  user: {
    sub: string;
    role: UserRole;
    divisionId: string | null;
  };
};

@ApiTags('News & Events')
@Controller('news-events')
export class NewsEventsController {
  constructor(
    private readonly newsEventsService: NewsEventsService,
    private readonly uploadsService: UploadsService,
    private readonly fileValidationPipe: FileValidationPipe,
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
  @ApiOperation({ summary: 'Upload image for News & Events' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({
    status: 400,
    description: 'No file uploaded or invalid file type.',
  })
  async uploadFile(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<ApiEnvelope<{ path: string }>> {
    await new Promise<void>((resolve, reject) => {
      multer(this.uploadsService.buildMulterOptions())
        .single('file')(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
    });

    const file = req.file as Express.Multer.File | undefined;
    await this.fileValidationPipe.transform(file);

    if (!file) {
      // pipe returns early if file is undefined; keep consistent message
      throw new BadRequestException('No file uploaded');
    }

    return { path: file.filename } as any;
  }

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Get all News & Events entries (public). Unauthenticated requests return PUBLISHED only.',
  })
  @ApiResponse({ status: 200, description: 'Paginated News & Events list.' })
  findAll(@Query() query: QueryNewsEventDto) {
    return this.newsEventsService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get News & Events entry by id (public)' })
  @ApiResponse({ status: 200, description: 'The requested entry.' })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  findOne(@Param('id') id: string) {
    return this.newsEventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a News & Events entry' })
  @ApiResponse({ status: 201, description: 'The entry has been created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Role required.' })
  create(@Body() dto: CreateNewsEventDto, @Req() req: AuthenticatedRequest) {
    return this.newsEventsService.create(dto, req.user as any);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Publish a News & Events entry',
    description: 'Returns 400 if already published.',
  })
  @ApiResponse({ status: 200, description: 'The entry has been published.' })
  @ApiResponse({ status: 400, description: 'Already published.' })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  publish(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.newsEventsService.publish(id, req.user.sub);
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Unpublish a News & Events entry',
    description: 'Returns 400 if currently draft.',
  })
  @ApiResponse({ status: 200, description: 'The entry has been unpublished.' })
  @ApiResponse({ status: 400, description: 'Not published.' })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  unpublish(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.newsEventsService.unpublish(id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a News & Events entry' })
  @ApiResponse({ status: 200, description: 'The entry has been updated.' })
  @ApiResponse({
    status: 400,
    description: 'Unpublish the entry before editing images.',
  })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsEventDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.newsEventsService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Delete a News & Events entry',
    description: 'Images are permanently deleted from disk.',
  })
  @ApiResponse({ status: 200, description: 'The entry has been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.newsEventsService.remove(id, req.user.sub);
  }
}

