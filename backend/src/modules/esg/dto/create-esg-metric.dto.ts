import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateEsgMetricDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  label: string;

  @IsString()
  @ApiProperty()
  value: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  suffix?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
