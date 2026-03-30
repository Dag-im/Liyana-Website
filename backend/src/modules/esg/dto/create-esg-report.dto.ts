import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { EsgReportType } from '../entities/esg-report.entity';

export class CreateEsgReportDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  year: string;

  @IsEnum(EsgReportType)
  @ApiProperty({ enum: EsgReportType })
  type: EsgReportType;

  @IsString()
  @ApiProperty()
  filePath: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
