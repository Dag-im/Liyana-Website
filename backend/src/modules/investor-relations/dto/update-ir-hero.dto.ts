import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateIrHeroDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  tagline?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  subtitle?: string;
}
