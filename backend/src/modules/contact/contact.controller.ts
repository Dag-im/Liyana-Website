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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/user-role.enum';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';

interface AuthenticatedRequest {
  user: {
    sub: string;
    role: UserRole;
  };
}

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  findAll(@Query() query: QueryContactDto) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  review(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.contactService.review(id, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.contactService.remove(id, req.user.sub);
  }
}
