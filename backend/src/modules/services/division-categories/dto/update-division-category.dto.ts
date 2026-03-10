import { PartialType } from '@nestjs/swagger';
import { CreateDivisionCategoryDto } from './create-division-category.dto';

export class UpdateDivisionCategoryDto extends PartialType(
  CreateDivisionCategoryDto,
) {}
