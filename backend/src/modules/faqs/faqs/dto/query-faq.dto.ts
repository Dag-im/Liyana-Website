import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/dto/query.dto';

export class QueryFaqDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  categoryId?: string;
}
