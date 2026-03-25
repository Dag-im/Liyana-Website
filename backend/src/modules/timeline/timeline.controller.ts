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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import multer from 'multer';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AppThrottlerGuard } from '../../common/guards/throttler.guard';
import { UserRole } from '../../common/types/user-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { QueryTimelineItemDto } from './dto/query-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';
import { TimelineService } from './timeline.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    role: UserRole;
  };
}

@ApiTags('Timeline')
@Controller('timeline')
@UseGuards(AppThrottlerGuard)
export class TimelineController {
  constructor(
    private readonly timelineService: TimelineService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('upload')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Req() req: AuthenticatedRequest & { file?: Express.Multer.File },
    @Res({ passthrough: true }) res: any,
  ) {
    await new Promise<void>((resolve, reject) => {
      multer(this.uploadsService.buildMulterOptions()).single('file')(
        req as any,
        res,
        (err) => {
          if (err) reject(err instanceof Error ? err : new Error(String(err)));
          else resolve();
        },
      );
    });

    const file = req.file;
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.uploadsService.createTempUpload(file.filename, req.user.sub);
  }

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAll(@Query() query: QueryTimelineItemDto) {
    return this.timelineService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findOne(@Param('id') id: string) {
    return this.timelineService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  create(
    @Body() createDto: CreateTimelineItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timelineService.create(createDto, req.user.sub);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTimelineItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timelineService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.timelineService.remove(id, req.user.sub);
  }
}
