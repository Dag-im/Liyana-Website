import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLucsWhoWeAreDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  content?: string;
}
