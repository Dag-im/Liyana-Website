import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEsgStrategyDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  content?: string;
}
