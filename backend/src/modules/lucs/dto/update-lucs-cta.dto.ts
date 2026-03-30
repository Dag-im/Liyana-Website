import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LucsCtaType } from '../entities/lucs-cta.entity';

export class UpdateLucsCtaDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsEnum(LucsCtaType)
  @ApiPropertyOptional({ enum: LucsCtaType })
  ctaType?: LucsCtaType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  ctaValue?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  ctaLabel?: string;
}
