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
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { ApiEnvelope } from '../../common/types/api-envelope.type';
import { UserRole } from '../../common/types/user-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { RejectBlogDto } from './dto/reject-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly uploadsService: UploadsService,
    private readonly fileValidationPipe: FileValidationPipe,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION, UserRole.BLOGGER)
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
  @ApiOperation({ summary: 'Upload image for blog posts' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({
    status: 400,
    description: 'No file uploaded or invalid file type.',
  })
  async uploadFile(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<ApiEnvelope<any>> {
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
    await this.fileValidationPipe.transform(file);

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return (await this.uploadsService.createTempUpload(
      file.filename,
      req.user.sub,
    )) as any;
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Get all blog posts (public). Unauthenticated requests default to PUBLISHED only.',
  })
  @ApiResponse({ status: 200, description: 'Paginated blog list.' })
  findAll(@Query() query: QueryBlogDto, @Req() req: any) {
    return this.blogsService.findAll(query, req.user);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get blog post by id (public)' })
  @ApiResponse({ status: 200, description: 'The requested blog post.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION, UserRole.BLOGGER)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a blog post' })
  @ApiResponse({ status: 201, description: 'The blog post has been created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Role required.' })
  create(@Body() dto: CreateBlogDto, @Req() req: any) {
    return this.blogsService.create(dto, req.user);
  }

  @Patch(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BLOGGER)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Submit a blog post for review',
    description: 'Only draft or rejected posts can be submitted.',
  })
  @ApiResponse({
    status: 200,
    description: 'The blog post has been submitted.',
  })
  @ApiResponse({ status: 400, description: 'Invalid blog status.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Blogger role required.',
  })
  submit(@Param('id') id: string, @Req() req: any) {
    return this.blogsService.submit(id, req.user);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Publish a blog post',
    description:
      'Only posts in PENDING_REVIEW can be published. Returns 400 otherwise.',
  })
  @ApiResponse({
    status: 200,
    description: 'The blog post has been published.',
  })
  @ApiResponse({
    status: 400,
    description: 'Only posts in PENDING_REVIEW can be published.',
  })
  publish(@Param('id') id: string, @Req() req: any) {
    return this.blogsService.publish(id, req.user.sub);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Reject a blog post',
    description:
      'Only posts in PENDING_REVIEW can be rejected. rejectionReason is required.',
  })
  @ApiResponse({ status: 200, description: 'The blog post has been rejected.' })
  @ApiResponse({
    status: 400,
    description: 'Only posts in PENDING_REVIEW can be rejected.',
  })
  reject(@Param('id') id: string, @Body() dto: RejectBlogDto, @Req() req: any) {
    return this.blogsService.reject(id, dto, req.user.sub);
  }

  @Patch(':id/feature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Feature a blog post',
    description:
      'Previously featured post is automatically unfeatured. Only published posts can be featured.',
  })
  @ApiResponse({ status: 200, description: 'The blog post is now featured.' })
  @ApiResponse({ status: 400, description: 'Invalid blog status.' })
  feature(@Param('id') id: string, @Req() req: any) {
    return this.blogsService.feature(id, req.user.sub);
  }

  @Patch(':id/unfeature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Remove a blog post from featured' })
  @ApiResponse({
    status: 200,
    description: 'The blog post is no longer featured.',
  })
  @ApiResponse({ status: 400, description: 'Post is not featured.' })
  unfeature(@Param('id') id: string, @Req() req: any) {
    return this.blogsService.unfeature(id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION, UserRole.BLOGGER)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiResponse({ status: 200, description: 'The blog post has been updated.' })
  @ApiResponse({ status: 400, description: 'Invalid blog status.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto, @Req() req: any) {
    return this.blogsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 200, description: 'The blog post has been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.blogsService.remove(id, req.user.sub);
  }
}
