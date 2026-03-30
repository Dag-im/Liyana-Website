import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateIrContactDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  address?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;
}
