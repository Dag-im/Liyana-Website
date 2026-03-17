import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/dto/query.dto';

export class QueryNetworkEntityDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  parentId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  relationId?: string;
}
