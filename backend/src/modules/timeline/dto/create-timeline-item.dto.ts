import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { TimelineCategory } from '../entity/timeline-item.entity';

export class CreateTimelineItemDto {
  @IsString()
  @Matches(/^\d{4}$/)
  @ApiProperty()
  year: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  location?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  achievement?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  image?: string;

  @IsOptional()
  @IsEnum(TimelineCategory)
  @ApiProperty({ required: false, enum: TimelineCategory })
  category?: TimelineCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
