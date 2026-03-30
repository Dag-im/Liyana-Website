import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateIrDivisionPerformanceDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  divisionName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  divisionId?: string;

  @IsString()
  @ApiProperty()
  revenuePercent: string;

  @IsString()
  @ApiProperty()
  growthPercent: string;

  @IsString()
  @ApiProperty()
  tag: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
