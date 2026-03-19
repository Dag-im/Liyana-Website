import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../common/types/user-role.enum';
import { UploadsService } from '../../../uploads/uploads.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { QueryServiceCategoryDto } from './dto/query-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategoriesService } from './service-categories.service';
import multer from 'multer';
import { BadRequestException, Res } from '@nestjs/common';
import { ApiEnvelope } from '../../../common/types/api-envelope.type';

@ApiTags('Service Categories')
@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(
    private readonly serviceCategoriesService: ServiceCategoriesService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @ApiOperation({ summary: 'Upload hero image for service category' })
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
      multer(this.uploadsService.buildMulterOptions()).single('file')(
        req,
        res,
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
    const file = req.file as Express.Multer.File;
    if (!file) throw new BadRequestException('No file uploaded');
    return { path: file.filename } as any; // Interceptor will wrap it, but type-wise we promise ApiEnvelope
  }

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all service categories (paginated)' })
  @ApiResponse({ status: 200, description: 'List of service categories.' })
  findAll(@Query() query: QueryServiceCategoryDto) {
    return this.serviceCategoriesService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get service category by id with relations' })
  @ApiResponse({ status: 200, description: 'The found service category.' })
  @ApiResponse({ status: 404, description: 'Service category not found.' })
  findOne(@Param('id') id: string) {
    return this.serviceCategoriesService.findOne(id);
  }

  @Get(':id/divisions')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all active divisions for a service category' })
  @ApiResponse({ status: 200, description: 'List of divisions for the category.' })
  @ApiResponse({ status: 404, description: 'Service category not found.' })
  findDivisions(@Param('id') id: string) {
    return this.serviceCategoriesService.findDivisions(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new service category' })
  @ApiResponse({
    status: 201,
    description: 'The service category has been created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  create(
    @Body() createDto: CreateServiceCategoryDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.serviceCategoriesService.create(createDto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a service category' })
  @ApiResponse({
    status: 200,
    description: 'The service category has been updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Service category not found.' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateServiceCategoryDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.serviceCategoriesService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a service category' })
  @ApiResponse({
    status: 200,
    description: 'The service category has been soft deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Service category not found.' })
  remove(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.serviceCategoriesService.remove(id, req.user.sub);
  }
}
