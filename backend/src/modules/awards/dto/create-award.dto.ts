import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAwardDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  organization: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'Year must be a 4-digit number' })
  @ApiProperty()
  year: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  category: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  image: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  imageAlt: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
