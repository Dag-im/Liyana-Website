import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';

export class QueryAwardDto extends QueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  year?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  category?: string;
}
