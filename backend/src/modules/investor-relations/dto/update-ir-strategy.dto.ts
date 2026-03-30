import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateIrStrategyDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  content?: string;
}
