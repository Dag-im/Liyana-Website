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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/user-role.enum';
import { AppThrottlerGuard } from '../../common/guards/throttler.guard';
import { UploadsService } from '../../uploads/uploads.service';
import { AwardsService } from './awards.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { QueryAwardDto } from './dto/query-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import multer from 'multer';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    role: UserRole;
  };
}

@ApiTags('Awards')
@Controller('awards')
@UseGuards(AppThrottlerGuard)
export class AwardsController {
  constructor(
    private readonly awardsService: AwardsService,
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
  findAll(@Query() query: QueryAwardDto) {
    return this.awardsService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findOne(@Param('id') id: string) {
    return this.awardsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  create(
    @Body() createAwardDto: CreateAwardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.awardsService.create(createAwardDto, req.user.sub);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  update(
    @Param('id') id: string,
    @Body() updateAwardDto: UpdateAwardDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.awardsService.update(id, updateAwardDto, req.user.sub);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.awardsService.remove(id, req.user.sub);
  }
}
