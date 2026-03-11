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
  UploadedFiles,
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
import { DivisionsService } from './divisions.service';
import multer from 'multer';
import { BadRequestException, Res } from '@nestjs/common';
import { ApiEnvelope } from '../../../common/types/api-envelope.type';
import { CreateDivisionDto } from './dto/create-division.dto';
import { QueryDivisionDto } from './dto/query-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';

@ApiTags('Divisions')
@Controller('divisions')
export class DivisionsController {
  constructor(
    private readonly divisionsService: DivisionsService,
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
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload images for division (logo, group photo, gallery)',
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully.' })
  @ApiResponse({
    status: 400,
    description: 'No files uploaded or invalid file type.',
  })
  async uploadFiles(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<ApiEnvelope<{ path: string }[]>> {
    await new Promise<void>((resolve, reject) => {
      multer(this.uploadsService.buildMulterOptions())
        .array('files', 10)(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
    });
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      throw new BadRequestException('No files uploaded');
    return files.map((file) => ({ path: file.filename })) as any;
  }

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all divisions (paginated/filtered)' })
  @ApiResponse({ status: 200, description: 'List of divisions.' })
  findAll(@Query() query: QueryDivisionDto) {
    return this.divisionsService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get division by id' })
  @ApiResponse({ status: 200, description: 'The requested division.' })
  @ApiResponse({ status: 404, description: 'Division not found.' })
  findOne(@Param('id') id: string) {
    return this.divisionsService.findOne(id);
  }

  @Get(':id/doctors')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get doctors in a division' })
  @ApiResponse({ status: 200, description: 'List of doctors.' })
  @ApiResponse({ status: 404, description: 'Division not found.' })
  findDoctors(@Param('id') id: string) {
    return this.divisionsService.findDoctors(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new division' })
  @ApiResponse({ status: 201, description: 'The division has been created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 409, description: 'Conflict. Slug already exists.' })
  create(
    @Body() createDto: CreateDivisionDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.divisionsService.create(createDto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a division' })
  @ApiResponse({ status: 200, description: 'The division has been updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Division not found.' })
  @ApiResponse({ status: 409, description: 'Conflict. Slug already exists.' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDivisionDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.divisionsService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a division' })
  @ApiResponse({ status: 200, description: 'The division has been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Division not found.' })
  remove(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.divisionsService.remove(id, req.user.sub);
  }
}
