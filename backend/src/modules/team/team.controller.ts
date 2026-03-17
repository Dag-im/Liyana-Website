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
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { QueryTeamMemberDto } from './dto/query-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamService } from './team.service';

type AuthenticatedRequest = {
  user: {
    sub: string;
    role: UserRole;
    divisionId: string | null;
  };
};

@ApiTags('Team & Leadership')
@Controller('team')
@UseGuards(ThrottlerGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('upload')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Upload member image' })
  async uploadImage() {
    return { message: 'Image upload endpoint' };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all team members',
    description: 'Hidden members are excluded unless includeHidden=true with auth',
  })
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  findAll(@Query() query: QueryTeamMemberDto) {
    return this.teamService.findAll(query);
  }

  @Get(':id')
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get team member by ID' })
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Create team member',
    description: 'Corporate members cannot be assigned to a division',
  })
  create(@Body() dto: CreateTeamMemberDto, @Req() req: AuthenticatedRequest) {
    return this.teamService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update team member' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTeamMemberDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.teamService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMMUNICATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete team member' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.teamService.remove(id, req.user.sub);
  }
}
