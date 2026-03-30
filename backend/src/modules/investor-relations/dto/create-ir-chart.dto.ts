import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IrChartType } from '../entities/ir-chart.entity';

export class IrChartDataPointDto {
  @IsString()
  @ApiProperty()
  label: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  value: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}

export class CreateIrChartDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsEnum(IrChartType)
  @ApiProperty({ enum: IrChartType })
  type: IrChartType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IrChartDataPointDto)
  @ApiProperty({ type: [IrChartDataPointDto] })
  dataPoints: IrChartDataPointDto[];
}
