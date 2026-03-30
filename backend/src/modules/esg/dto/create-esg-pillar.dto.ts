import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateEsgPillarDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  icon: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  document?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  initiatives: string[];
}
