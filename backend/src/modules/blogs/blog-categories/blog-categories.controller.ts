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
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategoriesService } from './blog-categories.service';

@ApiTags('Blog Categories')
@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @Get()
  @Throttle({ default: { limit: 120, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all blog categories (public)' })
  @ApiResponse({ status: 200, description: 'List of blog categories.' })
  findAll() {
    return this.blogCategoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a blog category' })
  @ApiResponse({ status: 201, description: 'Category created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  create(@Body() dto: CreateBlogCategoryDto, @Req() req: any) {
    return this.blogCategoriesService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a blog category' })
  @ApiResponse({ status: 200, description: 'Category updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogCategoryDto,
    @Req() req: any,
  ) {
    return this.blogCategoriesService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Delete a blog category',
    description:
      'Deletion is blocked if any blog posts reference the category.',
  })
  @ApiResponse({ status: 200, description: 'Category deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  @ApiResponse({
    status: 409,
    description: 'Category has assigned blog posts.',
  })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.blogCategoriesService.remove(id, req.user.sub);
  }
}
