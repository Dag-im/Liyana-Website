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
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/user-role.enum';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { QueryTestimonialPublicDto } from './dto/query-testimonial-public.dto';
import { QueryTestimonialDto } from './dto/query-testimonial.dto';
import { TestimonialCursorResponseDto } from './dto/testimonial-cursor-response.dto';
import { TestimonialsService } from './testimonials.service';

interface AuthenticatedRequest {
  user: {
    sub: string;
    role: UserRole;
  };
}

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @Get('public')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get approved testimonials with cursor pagination (public)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns cursor-paginated approved testimonials. hasMore false means no further pages.',
    type: TestimonialCursorResponseDto,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'ISO timestamp cursor from previous response nextCursor',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default 12, max 50)',
  })
  findPublic(@Query() query: QueryTestimonialPublicDto) {
    return this.testimonialsService.findPublic(query);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAll(@Query() query: QueryTestimonialDto, @Req() req: { user?: any }) {
    const includeAll = !!req.user;
    return this.testimonialsService.findAll(query, includeAll);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  approve(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.testimonialsService.approve(id, req.user.sub);
  }

  @Patch(':id/unapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  unapprove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.testimonialsService.unapprove(id, req.user.sub);
  }

  @Patch(':id/favorite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  favorite(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.testimonialsService.favorite(id, req.user.sub);
  }

  @Patch(':id/unfavorite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  unfavorite(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.testimonialsService.unfavorite(id, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.testimonialsService.remove(id, req.user.sub);
  }
}
