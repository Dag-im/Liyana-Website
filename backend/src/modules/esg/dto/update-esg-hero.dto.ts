import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEsgHeroDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  tagline?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  subtitle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  backgroundImage?: string;
}
