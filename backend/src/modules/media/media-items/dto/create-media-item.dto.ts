import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMediaItemDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  title: string;

  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'YouTube URL for videos, uploaded file path for images',
  })
  url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  thumbnail?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
