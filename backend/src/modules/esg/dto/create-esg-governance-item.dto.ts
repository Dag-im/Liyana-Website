import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { EsgGovernanceItemType } from '../entities/esg-governance-item.entity';

export class CreateEsgGovernanceItemDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  description: string;

  @IsEnum(EsgGovernanceItemType)
  @ApiProperty({ enum: EsgGovernanceItemType })
  type: EsgGovernanceItemType;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  document?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
