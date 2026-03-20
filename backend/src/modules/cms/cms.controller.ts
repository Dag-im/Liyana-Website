import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AppThrottlerGuard } from '../../common/guards/throttler.guard';
import { UserRole } from '../../common/types/user-role.enum';
import { CoreValuesService } from './core-values/core-values.service';
import { CreateCoreValueDto } from './core-values/dto/create-core-value.dto';
import { UpdateCoreValueDto } from './core-values/dto/update-core-value.dto';
import { MissionVisionService } from './mission-vision/mission-vision.service';
import { UpdateMissionVisionDto } from './mission-vision/dto/update-mission-vision.dto';
import { QualityPolicyService } from './quality-policy/quality-policy.service';
import { UpsertQualityPolicyDto } from './quality-policy/dto/upsert-quality-policy.dto';
import { CreateStatDto } from './stats/dto/create-stat.dto';
import { UpdateStatDto } from './stats/dto/update-stat.dto';
import { StatsService } from './stats/stats.service';
import { WhoWeAreService } from './who-we-are/who-we-are.service';
import { UpdateWhoWeAreDto } from './who-we-are/dto/update-who-we-are.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    role: UserRole;
  };
}

@ApiTags('CMS')
@Controller('cms')
@UseGuards(AppThrottlerGuard)
export class CmsController {
  constructor(
    private readonly missionVisionService: MissionVisionService,
    private readonly whoWeAreService: WhoWeAreService,
    private readonly coreValuesService: CoreValuesService,
    private readonly statsService: StatsService,
    private readonly qualityPolicyService: QualityPolicyService,
  ) {}

  @Get('mission-vision')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findMissionVision() {
    return this.missionVisionService.find();
  }

  @Put('mission-vision')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  updateMissionVision(
    @Body() dto: UpdateMissionVisionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.missionVisionService.update(dto, req.user.sub);
  }

  @Get('who-we-are')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findWhoWeAre() {
    return this.whoWeAreService.find();
  }

  @Put('who-we-are')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  updateWhoWeAre(
    @Body() dto: UpdateWhoWeAreDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.whoWeAreService.update(dto, req.user.sub);
  }

  @Get('core-values')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findCoreValues() {
    return this.coreValuesService.findAll();
  }

  @Post('core-values')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createCoreValue(
    @Body() dto: CreateCoreValueDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coreValuesService.create(dto, req.user.sub);
  }

  @Get('stats')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findStats() {
    return this.statsService.findAll();
  }

  @Post('stats')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createStat(@Body() dto: CreateStatDto, @Req() req: AuthenticatedRequest) {
    return this.statsService.create(dto, req.user.sub);
  }

  @Get('quality-policy')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findQualityPolicies() {
    return this.qualityPolicyService.findAll();
  }

  @Put('quality-policy/:lang')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  upsertQualityPolicy(
    @Param('lang') lang: string,
    @Body() dto: UpsertQualityPolicyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.qualityPolicyService.upsert(lang, dto, req.user.sub);
  }

  @Delete('quality-policy/:lang')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeQualityPolicy(
    @Param('lang') lang: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.qualityPolicyService.remove(lang, req.user.sub);
  }

  @Patch('core-values/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateCoreValue(
    @Param('id') id: string,
    @Body() dto: UpdateCoreValueDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.coreValuesService.update(id, dto, req.user.sub);
  }

  @Delete('core-values/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeCoreValue(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.coreValuesService.remove(id, req.user.sub);
  }

  @Patch('stats/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateStat(
    @Param('id') id: string,
    @Body() dto: UpdateStatDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.statsService.update(id, dto, req.user.sub);
  }

  @Delete('stats/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeStat(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.statsService.remove(id, req.user.sub);
  }
}
