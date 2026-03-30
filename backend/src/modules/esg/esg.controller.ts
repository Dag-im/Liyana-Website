import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { ApiEnvelope } from '../../common/types/api-envelope.type';
import { UserRole } from '../../common/types/user-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { CreateEsgGovernanceItemDto } from './dto/create-esg-governance-item.dto';
import { CreateEsgMetricDto } from './dto/create-esg-metric.dto';
import { CreateEsgPillarDto } from './dto/create-esg-pillar.dto';
import { CreateEsgReportDto } from './dto/create-esg-report.dto';
import { UpdateEsgGovernanceItemDto } from './dto/update-esg-governance-item.dto';
import { UpdateEsgHeroDto } from './dto/update-esg-hero.dto';
import { UpdateEsgLucsBridgeDto } from './dto/update-esg-lucs-bridge.dto';
import { UpdateEsgMetricDto } from './dto/update-esg-metric.dto';
import { UpdateEsgPillarDto } from './dto/update-esg-pillar.dto';
import { UpdateEsgReportDto } from './dto/update-esg-report.dto';
import { UpdateEsgStrategyDto } from './dto/update-esg-strategy.dto';
import { EsgService } from './esg.service';

type AuthenticatedRequest = {
  user: {
    sub: string;
    role: UserRole;
  };
};

@ApiTags('ESG')
@Controller('esg')
export class EsgController {
  constructor(
    private readonly esgService: EsgService,
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

  @Get('hero')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get ESG hero section',
    description: 'Returns null when the hero section is unpublished.',
  })
  findHero() {
    return this.esgService.findHero();
  }

  @Put('hero')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateHero(@Body() dto: UpdateEsgHeroDto, @Req() req: AuthenticatedRequest) {
    return this.esgService.updateHero(dto, req.user.sub);
  }

  @Patch('hero/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishHero() {
    return this.esgService.publishHero();
  }

  @Patch('hero/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishHero() {
    return this.esgService.unpublishHero();
  }

  @Get('strategy')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get ESG strategy section',
    description: 'Returns null when the strategy section is unpublished.',
  })
  findStrategy() {
    return this.esgService.findStrategy();
  }

  @Put('strategy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateStrategy(
    @Body() dto: UpdateEsgStrategyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.updateStrategy(dto, req.user.sub);
  }

  @Patch('strategy/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishStrategy() {
    return this.esgService.publishStrategy();
  }

  @Patch('strategy/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishStrategy() {
    return this.esgService.unpublishStrategy();
  }

  @Get('lucs-bridge')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get ESG LUCS bridge section',
    description: 'Returns null when the LUCS bridge section is unpublished.',
  })
  findLucsBridge() {
    return this.esgService.findLucsBridge();
  }

  @Put('lucs-bridge')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateLucsBridge(
    @Body() dto: UpdateEsgLucsBridgeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.updateLucsBridge(dto, req.user.sub);
  }

  @Patch('lucs-bridge/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishLucsBridge() {
    return this.esgService.publishLucsBridge();
  }

  @Patch('lucs-bridge/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishLucsBridge() {
    return this.esgService.unpublishLucsBridge();
  }

  @Get('pillars')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published ESG pillars for public requests and all pillars for admin or communication users.',
  })
  findAllPillars(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.esgService.findAllPillars(req.user);
  }

  @Post('pillars')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createPillar(@Body() dto: CreateEsgPillarDto, @Req() req: AuthenticatedRequest) {
    return this.esgService.createPillar(dto, req.user.sub);
  }

  @Patch('pillars/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishPillar(@Param('id') id: string) {
    return this.esgService.publishPillar(id);
  }

  @Patch('pillars/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishPillar(@Param('id') id: string) {
    return this.esgService.unpublishPillar(id);
  }

  @Patch('pillars/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updatePillar(
    @Param('id') id: string,
    @Body() dto: UpdateEsgPillarDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.updatePillar(id, dto, req.user.sub);
  }

  @Delete('pillars/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removePillar(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.esgService.removePillar(id, req.user.sub);
  }

  @Get('metrics')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published ESG metrics for public requests and all metrics for admin or communication users.',
  })
  findAllMetrics(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.esgService.findAllMetrics(req.user);
  }

  @Post('metrics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createMetric(@Body() dto: CreateEsgMetricDto, @Req() req: AuthenticatedRequest) {
    return this.esgService.createMetric(dto, req.user.sub);
  }

  @Patch('metrics/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishMetric(@Param('id') id: string) {
    return this.esgService.publishMetric(id);
  }

  @Patch('metrics/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishMetric(@Param('id') id: string) {
    return this.esgService.unpublishMetric(id);
  }

  @Patch('metrics/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateMetric(
    @Param('id') id: string,
    @Body() dto: UpdateEsgMetricDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.updateMetric(id, dto, req.user.sub);
  }

  @Delete('metrics/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeMetric(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.esgService.removeMetric(id, req.user.sub);
  }

  @Get('governance')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published ESG governance items for public requests and all items for admin or communication users.',
  })
  findAllGovernance(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.esgService.findAllGovernance(req.user);
  }

  @Post('governance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createGovernanceItem(
    @Body() dto: CreateEsgGovernanceItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.createGovernanceItem(dto, req.user.sub);
  }

  @Patch('governance/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishGovernanceItem(@Param('id') id: string) {
    return this.esgService.publishGovernanceItem(id);
  }

  @Patch('governance/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishGovernanceItem(@Param('id') id: string) {
    return this.esgService.unpublishGovernanceItem(id);
  }

  @Patch('governance/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateGovernanceItem(
    @Param('id') id: string,
    @Body() dto: UpdateEsgGovernanceItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.updateGovernanceItem(id, dto, req.user.sub);
  }

  @Delete('governance/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeGovernanceItem(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.removeGovernanceItem(id, req.user.sub);
  }

  @Get('reports')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published ESG reports for public requests and all reports for admin or communication users.',
  })
  findAllReports(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.esgService.findAllReports(req.user);
  }

  @Post('reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createReport(@Body() dto: CreateEsgReportDto, @Req() req: AuthenticatedRequest) {
    return this.esgService.createReport(dto, req.user.sub);
  }

  @Patch('reports/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishReport(@Param('id') id: string) {
    return this.esgService.publishReport(id);
  }

  @Patch('reports/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishReport(@Param('id') id: string) {
    return this.esgService.unpublishReport(id);
  }

  @Patch('reports/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateReport(
    @Param('id') id: string,
    @Body() dto: UpdateEsgReportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.esgService.updateReport(id, dto, req.user.sub);
  }

  @Delete('reports/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeReport(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.esgService.removeReport(id, req.user.sub);
  }
}
