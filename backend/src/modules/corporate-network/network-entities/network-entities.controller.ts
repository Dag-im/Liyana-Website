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
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../common/types/user-role.enum';
import { CreateNetworkEntityDto } from './dto/create-network-entity.dto';
import { MoveNetworkEntityDto } from './dto/move-network-entity.dto';
import { QueryNetworkEntityDto } from './dto/query-network-entity.dto';
import { UpdateNetworkEntityDto } from './dto/update-network-entity.dto';
import { NetworkEntitiesService } from './network-entities.service';

@ApiTags('Network Entities')
@Controller('network-entities')
export class NetworkEntitiesController {
  constructor(private readonly entitiesService: NetworkEntitiesService) {}

  @Get('tree')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get all network entities as a recursive tree',
    description: 'Returns the full recursive tree, no pagination.',
  })
  findTree() {
    return this.entitiesService.findTree();
  }

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all network entities (flat paginated list)' })
  findAll(@Query() query: QueryNetworkEntityDto) {
    return this.entitiesService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get a network entity with direct children' })
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a network entity' })
  create(
    @Body() dto: CreateNetworkEntityDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.entitiesService.create(dto, req.user.sub);
  }

  @Patch(':id/move')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Move a network entity (change parent)',
    description: 'Supports cycle detection. parentId: null promotes to root.',
  })
  move(
    @Param('id') id: string,
    @Body() dto: MoveNetworkEntityDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.entitiesService.move(id, dto, req.user.sub);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a network entity' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNetworkEntityDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.entitiesService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Delete a network entity',
    description: 'Target and all its descendants are recursively soft-deleted.',
  })
  remove(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.entitiesService.remove(id, req.user.sub);
  }
}
