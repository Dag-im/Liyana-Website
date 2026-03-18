import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq-category.dto';
import { FaqCategoriesService } from './faq-categories.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    role: UserRole;
  };
}

@ApiTags('FAQ Categories')
@Controller('faq-categories')
@UseGuards(AppThrottlerGuard)
export class FaqCategoriesController {
  constructor(private readonly faqCategoriesService: FaqCategoriesService) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAll() {
    return this.faqCategoriesService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  create(@Body() dto: CreateFaqCategoryDto, @Req() req: AuthenticatedRequest) {
    return this.faqCategoriesService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFaqCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.faqCategoriesService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.faqCategoriesService.remove(id, req.user.sub);
  }
}
