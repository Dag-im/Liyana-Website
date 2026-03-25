import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
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
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../common/types/user-role.enum';
import { UploadsService } from '../../../uploads/uploads.service';
import { DoctorsService } from './doctors.service';
import multer from 'multer';
import { BadRequestException, Req, Res } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import type { Request, Response } from 'express';

@ApiTags('Doctors')
@Controller('divisions/:divisionId/doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
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
  @ApiOperation({ summary: 'Upload profile image for doctor' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({
    status: 400,
    description: 'No file uploaded or invalid file type.',
  })
  async uploadFile(
    @Req() req: Request & { file?: Express.Multer.File; user: { sub: string } },
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    await new Promise<void>((resolve, reject) => {
      multer(this.uploadsService.buildMulterOptions()).single('file')(
        req,
        res,
        (err) => {
          if (err) {
            reject(err instanceof Error ? err : new Error('Upload failed'));
            return;
          }
          resolve();
        },
      );
    });
    const file = req.file;
    if (!file) throw new BadRequestException('No file uploaded');
    return this.uploadsService.createTempUpload(file.filename, req.user.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DIVISION_MANAGER)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new doctor for a division' })
  @ApiResponse({ status: 201, description: 'The doctor has been created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Division not found.' })
  create(
    @Param('divisionId') divisionId: string,
    @Body() createDto: CreateDoctorDto,
    @Req() req: { user: { sub: string; role: UserRole; divisionId: string | null } },
  ) {
    return this.doctorsService.create(
      divisionId,
      createDto,
      req.user.sub,
      req.user.role,
      req.user.divisionId,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DIVISION_MANAGER)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, description: 'The doctor has been updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Doctor or Division not found.' })
  update(
    @Param('divisionId') divisionId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateDoctorDto,
    @Req() req: { user: { sub: string; role: UserRole; divisionId: string | null } },
  ) {
    return this.doctorsService.update(
      divisionId,
      id,
      updateDto,
      req.user.sub,
      req.user.role,
      req.user.divisionId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DIVISION_MANAGER)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiResponse({ status: 200, description: 'The doctor has been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Doctor or Division not found.' })
  remove(
    @Param('divisionId') divisionId: string,
    @Param('id') id: string,
    @Req() req: { user: { role: UserRole; divisionId: string | null } },
  ) {
    return this.doctorsService.remove(
      divisionId,
      id,
      req.user.role,
      req.user.divisionId,
    );
  }
}
