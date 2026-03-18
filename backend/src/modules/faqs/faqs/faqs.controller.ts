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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AppThrottlerGuard } from '../../../common/guards/throttler.guard';
import { UserRole } from '../../../common/types/user-role.enum';
import { CreateFaqDto } from './dto/create-faq.dto';
import { QueryFaqDto } from './dto/query-faq.dto';
import { ReorderFaqDto } from './dto/reorder-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FaqsService } from './faqs.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    role: UserRole;
  };
}

@ApiTags('FAQs')
@Controller('faqs')
@UseGuards(AppThrottlerGuard)
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAll(@Query() query: QueryFaqDto) {
    return this.faqsService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  create(@Body() dto: CreateFaqDto, @Req() req: AuthenticatedRequest) {
    return this.faqsService.create(dto, req.user.sub);
  }

  @Patch(':id/reorder')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  reorder(
    @Param('id') id: string,
    @Body() dto: ReorderFaqDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.faqsService.reorder(id, dto, req.user.sub);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFaqDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.faqsService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.faqsService.remove(id, req.user.sub);
  }
}
