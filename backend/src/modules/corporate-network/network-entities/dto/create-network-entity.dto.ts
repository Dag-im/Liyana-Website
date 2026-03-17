import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateNetworkEntityDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  summary: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  description: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  insight: string;

  @IsString()
  @ApiProperty()
  icon: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, default: 0 })
  sortOrder?: number;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false })
  parentId?: string | null;

  @IsUUID()
  @ApiProperty()
  relationId: string;
}
