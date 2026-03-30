import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateIrFinancialColumnDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  label: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  key: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
