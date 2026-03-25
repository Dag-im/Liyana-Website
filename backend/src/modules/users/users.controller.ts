import {
  BadRequestException,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/types/user-role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

type AuthenticatedRequest = {
  user: {
    sub: string;
    role: UserRole;
    divisionId: string | null;
  };
};

@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIVISION_MANAGER)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Create a user (Admin or Division Manager). Managers can only create CUSTOMER_SERVICE users for their own division. Rate limit: 20 requests per 60 seconds.',
  })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.role === UserRole.DIVISION_MANAGER) {
      if (createUserDto.role !== UserRole.CUSTOMER_SERVICE) {
        throw new BadRequestException(
          'Division managers can only create customer service users',
        );
      }
      if (createUserDto.divisionId !== req.user.divisionId) {
        throw new BadRequestException(
          'Division managers can only create users for their own division',
        );
      }
    }

    return this.usersService.create(createUserDto, req.user.sub);
  }

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({
    summary:
      'List users with pagination and filtering. Division managers only see customer service users in their own division. Rate limit: 60 requests per 60 seconds.',
  })
  @ApiQuery({ type: QueryUserDto })
  @ApiResponse({
    status: 200,
    description: 'Paginated users response.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(
    @Query() queryUserDto: QueryUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.role === UserRole.DIVISION_MANAGER) {
      if (!req.user.divisionId) {
        throw new BadRequestException(
          'Division managers must be assigned to a division',
        );
      }
      return this.usersService.findAll({
        ...queryUserDto,
        role: UserRole.CUSTOMER_SERVICE,
        divisionId: req.user.divisionId,
      });
    }

    return this.usersService.findAll(queryUserDto);
  }

  @Get(':id')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get user by ID. Rate limit: 60 requests per 60 seconds.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User fetched successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIVISION_MANAGER)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Update user (Admin or Division Manager). Managers can only update customer service users in their own division. Rate limit: 20 requests per 60 seconds.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
      req.user.sub,
      req.user.role,
      req.user.divisionId,
    );
  }

  @Patch(':id/password')
  @Roles(UserRole.ADMIN)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Admin changes user password. Rate limit: 10 requests per 60 seconds.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.changePassword(
      id,
      changePasswordDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIVISION_MANAGER)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Deactivate and soft-delete a user (Admin or Division Manager). Managers can only remove customer service users in their own division. Rate limit: 10 requests per 60 seconds.',
    description:
      'This endpoint deactivates and soft-deletes the user. It does not hard-delete records.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User deactivated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.usersService.remove(
      id,
      req.user.sub,
      req.user.role,
      req.user.divisionId,
    );
  }
}
