import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class BulletPointDto {
  @IsString()
  @ApiProperty()
  point: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;
}

export class CreateLucsPillarDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @ApiProperty()
  icon: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulletPointDto)
  @ApiProperty({ type: [BulletPointDto] })
  bulletPoints: BulletPointDto[];
}
