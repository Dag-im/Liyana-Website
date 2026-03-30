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
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';
import { ApiEnvelope } from '../../common/types/api-envelope.type';
import { UserRole } from '../../common/types/user-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { CreateIrChartDto } from './dto/create-ir-chart.dto';
import { CreateIrDivisionPerformanceDto } from './dto/create-ir-division-performance.dto';
import { CreateIrDocumentDto } from './dto/create-ir-document.dto';
import { CreateIrFinancialColumnDto } from './dto/create-ir-financial-column.dto';
import { CreateIrFinancialRowDto } from './dto/create-ir-financial-row.dto';
import { CreateIrInquiryDto } from './dto/create-ir-inquiry.dto';
import { CreateIrKpiDto } from './dto/create-ir-kpi.dto';
import { QueryIrInquiryDto } from './dto/query-ir-inquiry.dto';
import { UpdateIrChartDto } from './dto/update-ir-chart.dto';
import { UpdateIrContactDto } from './dto/update-ir-contact.dto';
import { UpdateIrDivisionPerformanceDto } from './dto/update-ir-division-performance.dto';
import { UpdateIrDocumentDto } from './dto/update-ir-document.dto';
import { UpdateIrFinancialColumnDto } from './dto/update-ir-financial-column.dto';
import { UpdateIrFinancialRowDto } from './dto/update-ir-financial-row.dto';
import { UpdateIrHeroDto } from './dto/update-ir-hero.dto';
import { UpdateIrKpiDto } from './dto/update-ir-kpi.dto';
import { UpdateIrStrategyDto } from './dto/update-ir-strategy.dto';
import { IrService } from './ir.service';

type AuthenticatedRequest = {
  user: {
    sub: string;
    role: UserRole;
  };
};

@ApiTags('Investor Relations')
@Controller('ir')
export class IrController {
  constructor(
    private readonly irService: IrService,
    private readonly uploadsService: UploadsService,
    private readonly fileValidationPipe: FileValidationPipe,
  ) {}

  @Get('hero')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get investor relations hero section',
    description: 'Returns null when the hero section is unpublished.',
  })
  findHero() {
    return this.irService.findHero();
  }

  @Put('hero')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateHero(@Body() dto: UpdateIrHeroDto, @Req() req: AuthenticatedRequest) {
    return this.irService.updateHero(dto, req.user.sub);
  }

  @Patch('hero/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishHero() {
    return this.irService.publishHero();
  }

  @Patch('hero/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishHero() {
    return this.irService.unpublishHero();
  }

  @Get('strategy')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get investor relations strategy section',
    description: 'Returns null when the strategy section is unpublished.',
  })
  findStrategy() {
    return this.irService.findStrategy();
  }

  @Put('strategy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateStrategy(
    @Body() dto: UpdateIrStrategyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.updateStrategy(dto, req.user.sub);
  }

  @Patch('strategy/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishStrategy() {
    return this.irService.publishStrategy();
  }

  @Patch('strategy/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishStrategy() {
    return this.irService.unpublishStrategy();
  }

  @Get('contact')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get investor relations contact section',
    description: 'Returns null when the contact section is unpublished.',
  })
  findContact() {
    return this.irService.findContact();
  }

  @Put('contact')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateContact(
    @Body() dto: UpdateIrContactDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.updateContact(dto, req.user.sub);
  }

  @Patch('contact/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishContact() {
    return this.irService.publishContact();
  }

  @Patch('contact/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishContact() {
    return this.irService.unpublishContact();
  }

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

  @Get('kpis')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published IR KPIs for public requests and all KPIs for admin or communication users.',
  })
  findAllKpis(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.irService.findAllKpis(req.user);
  }

  @Post('kpis')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createKpi(@Body() dto: CreateIrKpiDto, @Req() req: AuthenticatedRequest) {
    return this.irService.createKpi(dto, req.user.sub);
  }

  @Patch('kpis/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishKpi(@Param('id') id: string) {
    return this.irService.publishKpi(id);
  }

  @Patch('kpis/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishKpi(@Param('id') id: string) {
    return this.irService.unpublishKpi(id);
  }

  @Patch('kpis/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateKpi(
    @Param('id') id: string,
    @Body() dto: UpdateIrKpiDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.updateKpi(id, dto, req.user.sub);
  }

  @Delete('kpis/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeKpi(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.irService.removeKpi(id, req.user.sub);
  }

  @Get('financial-columns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAllFinancialColumns() {
    return this.irService.findAllFinancialColumns();
  }

  @Post('financial-columns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createFinancialColumn(@Body() dto: CreateIrFinancialColumnDto) {
    return this.irService.createFinancialColumn(dto);
  }

  @Patch('financial-columns/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateFinancialColumn(
    @Param('id') id: string,
    @Body() dto: UpdateIrFinancialColumnDto,
  ) {
    return this.irService.updateFinancialColumn(id, dto);
  }

  @Delete('financial-columns/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeFinancialColumn(@Param('id') id: string) {
    return this.irService.removeFinancialColumn(id);
  }

  @Get('financial-rows')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published financial rows for public requests and all rows for admin or communication users, with financial columns included.',
  })
  getFinancialTable(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.irService.getFinancialTable(req.user);
  }

  @Post('financial-rows')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createFinancialRow(
    @Body() dto: CreateIrFinancialRowDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.createFinancialRow(dto, req.user.sub);
  }

  @Patch('financial-rows/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishFinancialRow(@Param('id') id: string) {
    return this.irService.publishFinancialRow(id);
  }

  @Patch('financial-rows/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishFinancialRow(@Param('id') id: string) {
    return this.irService.unpublishFinancialRow(id);
  }

  @Patch('financial-rows/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateFinancialRow(
    @Param('id') id: string,
    @Body() dto: UpdateIrFinancialRowDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.updateFinancialRow(id, dto, req.user.sub);
  }

  @Delete('financial-rows/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeFinancialRow(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.irService.removeFinancialRow(id, req.user.sub);
  }

  @Get('division-performance')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published division performance items for public requests and all items for admin or communication users.',
  })
  findAllDivisionPerformance(
    @Req() req: { user?: AuthenticatedRequest['user'] | null },
  ) {
    return this.irService.findAllDivisionPerformance(req.user);
  }

  @Post('division-performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createDivisionPerformance(@Body() dto: CreateIrDivisionPerformanceDto) {
    return this.irService.createDivisionPerformance(dto);
  }

  @Patch('division-performance/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishDivisionPerformance(@Param('id') id: string) {
    return this.irService.publishDivisionPerformance(id);
  }

  @Patch('division-performance/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishDivisionPerformance(@Param('id') id: string) {
    return this.irService.unpublishDivisionPerformance(id);
  }

  @Patch('division-performance/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateDivisionPerformance(
    @Param('id') id: string,
    @Body() dto: UpdateIrDivisionPerformanceDto,
  ) {
    return this.irService.updateDivisionPerformance(id, dto);
  }

  @Delete('division-performance/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeDivisionPerformance(@Param('id') id: string) {
    return this.irService.removeDivisionPerformance(id);
  }

  @Get('charts')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published charts for public requests and all charts for admin or communication users.',
  })
  findAllCharts(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.irService.findAllCharts(req.user);
  }

  @Post('charts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createChart(@Body() dto: CreateIrChartDto, @Req() req: AuthenticatedRequest) {
    return this.irService.createChart(dto, req.user.sub);
  }

  @Patch('charts/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishChart(@Param('id') id: string) {
    return this.irService.publishChart(id);
  }

  @Patch('charts/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishChart(@Param('id') id: string) {
    return this.irService.unpublishChart(id);
  }

  @Patch('charts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateChart(
    @Param('id') id: string,
    @Body() dto: UpdateIrChartDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.updateChart(id, dto, req.user.sub);
  }

  @Delete('charts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeChart(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.irService.removeChart(id, req.user.sub);
  }

  @Get('documents')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published documents for public requests and all documents for admin or communication users.',
  })
  findAllDocuments(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.irService.findAllDocuments(req.user);
  }

  @Post('documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createDocument(
    @Body() dto: CreateIrDocumentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.createDocument(dto, req.user.sub);
  }

  @Patch('documents/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishDocument(@Param('id') id: string) {
    return this.irService.publishDocument(id);
  }

  @Patch('documents/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishDocument(@Param('id') id: string) {
    return this.irService.unpublishDocument(id);
  }

  @Patch('documents/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateDocument(
    @Param('id') id: string,
    @Body() dto: UpdateIrDocumentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.irService.updateDocument(id, dto, req.user.sub);
  }

  @Delete('documents/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeDocument(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.irService.removeDocument(id, req.user.sub);
  }

  @Post('inquiries')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  createInquiry(@Body() dto: CreateIrInquiryDto) {
    return this.irService.createInquiry(dto);
  }

  @Get('inquiries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAllInquiries(@Query() query: QueryIrInquiryDto) {
    return this.irService.findAllInquiries(query);
  }

  @Get('inquiries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findInquiry(@Param('id') id: string) {
    return this.irService.findInquiry(id);
  }

  @Patch('inquiries/:id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  reviewInquiry(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.irService.reviewInquiry(id, req.user.sub);
  }

  @Delete('inquiries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeInquiry(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.irService.removeInquiry(id, req.user.sub);
  }
}
