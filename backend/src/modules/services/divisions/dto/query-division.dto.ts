import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/dto/query.dto';

export class QueryDivisionDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  serviceCategoryId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  divisionCategoryId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiPropertyOptional()
  isActive?: boolean;
}
