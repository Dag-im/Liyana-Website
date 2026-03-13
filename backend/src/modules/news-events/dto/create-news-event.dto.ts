import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { NewsEventType } from '../entity/news-event.entity';

export class CreateNewsEventDto {
  @IsEnum(NewsEventType)
  @ApiProperty({ enum: NewsEventType })
  type!: NewsEventType;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  title!: string;

  @IsDateString()
  @ApiProperty()
  date!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  location?: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  summary!: string;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1)
  @ApiProperty({ type: [String] })
  content!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ required: false, type: [String] })
  keyHighlights?: string[];

  @IsString()
  @ApiProperty()
  mainImage!: string;

  @IsString()
  @ApiProperty()
  image1!: string;

  @IsString()
  @ApiProperty()
  image2!: string;
}

