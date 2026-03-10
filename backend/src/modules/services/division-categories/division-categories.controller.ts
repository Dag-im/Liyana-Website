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
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../common/types/user-role.enum';
import { DivisionCategoriesService } from './division-categories.service';
import { CreateDivisionCategoryDto } from './dto/create-division-category.dto';
import { UpdateDivisionCategoryDto } from './dto/update-division-category.dto';

@ApiTags('Division Categories')
@Controller('division-categories')
export class DivisionCategoriesController {
  constructor(
    private readonly divisionCategoriesService: DivisionCategoriesService,
  ) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all division categories' })
  @ApiResponse({ status: 200, description: 'List of all division categories.' })
  findAll() {
    return this.divisionCategoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new division category' })
  @ApiResponse({
    status: 201,
    description: 'The division category has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 409, description: 'Conflict. Name already exists.' })
  create(
    @Body() createDto: CreateDivisionCategoryDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.divisionCategoriesService.create(createDto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a division category' })
  @ApiResponse({
    status: 200,
    description: 'The division category has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Division category not found.' })
  @ApiResponse({ status: 409, description: 'Conflict. Name already exists.' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDivisionCategoryDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.divisionCategoriesService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a division category' })
  @ApiResponse({
    status: 200,
    description: 'The division category has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Division category not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Category has divisions assigned to it.',
  })
  remove(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.divisionCategoriesService.remove(id, req.user.sub);
  }
}
