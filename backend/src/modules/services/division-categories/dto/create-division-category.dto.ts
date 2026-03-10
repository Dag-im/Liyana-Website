import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDivisionCategoryDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  label: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;
}
