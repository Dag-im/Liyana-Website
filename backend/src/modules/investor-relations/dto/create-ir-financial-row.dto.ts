import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IrFinancialPeriodType } from '../entities/ir-financial-row.entity';

export class IrFinancialCellInputDto {
  @IsString()
  @ApiProperty()
  columnId: string;

  @IsString()
  @ApiProperty()
  value: string;
}

export class CreateIrFinancialRowDto {
  @IsString()
  @ApiProperty()
  period: string;

  @IsEnum(IrFinancialPeriodType)
  @ApiProperty({ enum: IrFinancialPeriodType })
  periodType: IrFinancialPeriodType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IrFinancialCellInputDto)
  @ApiProperty({ type: [IrFinancialCellInputDto] })
  cells: IrFinancialCellInputDto[];
}
