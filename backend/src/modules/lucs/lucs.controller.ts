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
import { CreateLucsInquiryDto } from './dto/create-lucs-inquiry.dto';
import { CreateLucsPillarDto } from './dto/create-lucs-pillar.dto';
import { QueryLucsInquiryDto } from './dto/query-lucs-inquiry.dto';
import { UpdateLucsCtaDto } from './dto/update-lucs-cta.dto';
import { UpdateLucsHeroDto } from './dto/update-lucs-hero.dto';
import { UpdateLucsMissionDto } from './dto/update-lucs-mission.dto';
import { UpdateLucsPillarDto } from './dto/update-lucs-pillar.dto';
import { UpdateLucsPillarIntroDto } from './dto/update-lucs-pillar-intro.dto';
import { UpdateLucsWhoWeAreDto } from './dto/update-lucs-who-we-are.dto';
import { LucsService } from './lucs.service';

type AuthenticatedRequest = {
  user: {
    sub: string;
    role: UserRole;
  };
};

@ApiTags('LUCS')
@Controller('lucs')
export class LucsController {
  constructor(
    private readonly lucsService: LucsService,
    private readonly uploadsService: UploadsService,
    private readonly fileValidationPipe: FileValidationPipe,
  ) {}

  @Get('hero')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get LUCS hero section',
    description: 'Returns null when the hero section is unpublished.',
  })
  findHero() {
    return this.lucsService.findHero();
  }

  @Put('hero')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateHero(@Body() dto: UpdateLucsHeroDto, @Req() req: AuthenticatedRequest) {
    return this.lucsService.updateHero(dto, req.user.sub);
  }

  @Patch('hero/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishHero() {
    return this.lucsService.publishHero();
  }

  @Patch('hero/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishHero() {
    return this.lucsService.unpublishHero();
  }

  @Get('who-we-are')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get LUCS who we are section',
    description: 'Returns null when the section is unpublished.',
  })
  findWhoWeAre() {
    return this.lucsService.findWhoWeAre();
  }

  @Put('who-we-are')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateWhoWeAre(
    @Body() dto: UpdateLucsWhoWeAreDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.lucsService.updateWhoWeAre(dto, req.user.sub);
  }

  @Patch('who-we-are/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishWhoWeAre() {
    return this.lucsService.publishWhoWeAre();
  }

  @Patch('who-we-are/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishWhoWeAre() {
    return this.lucsService.unpublishWhoWeAre();
  }

  @Get('mission')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get LUCS mission section',
    description: 'Returns null when the section is unpublished.',
  })
  findMission() {
    return this.lucsService.findMission();
  }

  @Put('mission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateMission(
    @Body() dto: UpdateLucsMissionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.lucsService.updateMission(dto, req.user.sub);
  }

  @Patch('mission/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishMission() {
    return this.lucsService.publishMission();
  }

  @Patch('mission/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishMission() {
    return this.lucsService.unpublishMission();
  }

  @Get('pillar-intro')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get LUCS pillar intro section',
    description: 'Returns null when the section is unpublished.',
  })
  findPillarIntro() {
    return this.lucsService.findPillarIntro();
  }

  @Put('pillar-intro')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updatePillarIntro(
    @Body() dto: UpdateLucsPillarIntroDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.lucsService.updatePillarIntro(dto, req.user.sub);
  }

  @Patch('pillar-intro/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishPillarIntro() {
    return this.lucsService.publishPillarIntro();
  }

  @Patch('pillar-intro/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishPillarIntro() {
    return this.lucsService.unpublishPillarIntro();
  }

  @Get('cta')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get LUCS CTA section',
    description: 'Returns null when the section is unpublished.',
  })
  findCta() {
    return this.lucsService.findCta();
  }

  @Put('cta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updateCta(@Body() dto: UpdateLucsCtaDto, @Req() req: AuthenticatedRequest) {
    return this.lucsService.updateCta(dto, req.user.sub);
  }

  @Patch('cta/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishCta() {
    return this.lucsService.publishCta();
  }

  @Patch('cta/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishCta() {
    return this.lucsService.unpublishCta();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
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

  @Get('pillars')
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiResponse({
    status: 200,
    description:
      'Returns published LUCS pillars for public requests and all pillars for admin or LUCS admin users.',
  })
  findAllPillars(@Req() req: { user?: AuthenticatedRequest['user'] | null }) {
    return this.lucsService.findAllPillars(req.user);
  }

  @Post('pillars')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createPillar(@Body() dto: CreateLucsPillarDto, @Req() req: AuthenticatedRequest) {
    return this.lucsService.createPillar(dto, req.user.sub);
  }

  @Patch('pillars/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  publishPillar(@Param('id') id: string) {
    return this.lucsService.publishPillar(id);
  }

  @Patch('pillars/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  unpublishPillar(@Param('id') id: string) {
    return this.lucsService.unpublishPillar(id);
  }

  @Patch('pillars/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  updatePillar(
    @Param('id') id: string,
    @Body() dto: UpdateLucsPillarDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.lucsService.updatePillar(id, dto, req.user.sub);
  }

  @Delete('pillars/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removePillar(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.lucsService.removePillar(id, req.user.sub);
  }

  @Post('inquiries')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  createInquiry(@Body() dto: CreateLucsInquiryDto) {
    return this.lucsService.createInquiry(dto);
  }

  @Get('inquiries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAllInquiries(@Query() query: QueryLucsInquiryDto) {
    return this.lucsService.findAllInquiries(query);
  }

  @Get('inquiries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findInquiry(@Param('id') id: string) {
    return this.lucsService.findInquiry(id);
  }

  @Patch('inquiries/:id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LUCS_ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  reviewInquiry(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.lucsService.reviewInquiry(id, req.user.sub);
  }

  @Delete('inquiries/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  removeInquiry(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.lucsService.removeInquiry(id, req.user.sub);
  }
}
