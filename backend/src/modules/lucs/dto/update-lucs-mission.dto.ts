import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLucsMissionDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  missionTitle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  missionDescription?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  missionIcon?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  visionTitle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  visionDescription?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  visionIcon?: string;
}
