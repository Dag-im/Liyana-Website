import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MinLength } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  attributes: string[];
}
