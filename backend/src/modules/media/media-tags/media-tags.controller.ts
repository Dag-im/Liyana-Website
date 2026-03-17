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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { MediaTagsService } from './media-tags.service';
import { CreateMediaTagDto } from './dto/create-media-tag.dto';
import { UpdateMediaTagDto } from './dto/update-media-tag.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/types/user-role.enum';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Media Tags')
@Controller('media-tags')
export class MediaTagsController {
  constructor(private readonly tagsService: MediaTagsService) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAll() {
    return this.tagsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  create(@Body() dto: CreateMediaTagDto, @Req() req: any) {
    return this.tagsService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaTagDto,
    @Req() req: any,
  ) {
    return this.tagsService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.tagsService.remove(id, req.user.sub);
  }
}
