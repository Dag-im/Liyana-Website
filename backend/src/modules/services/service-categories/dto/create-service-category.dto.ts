import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  tagline: string;

  @IsString()
  @ApiProperty()
  heroImage: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, default: 'Hospital' })
  icon?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  attributes: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, default: 0 })
  sortOrder?: number;
}
