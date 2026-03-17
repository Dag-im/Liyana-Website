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
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../common/types/user-role.enum';
import { CreateNetworkRelationDto } from './dto/create-network-relation.dto';
import { UpdateNetworkRelationDto } from './dto/update-network-relation.dto';
import { NetworkRelationsService } from './network-relations.service';

@ApiTags('Network Relations')
@Controller('network-relations')
export class NetworkRelationsController {
  constructor(private readonly relationsService: NetworkRelationsService) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all network relations' })
  findAll() {
    return this.relationsService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a network relation' })
  create(
    @Body() dto: CreateNetworkRelationDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.relationsService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a network relation' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNetworkRelationDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.relationsService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a network relation' })
  remove(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.relationsService.remove(id, req.user.sub);
  }
}
