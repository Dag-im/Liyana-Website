import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../../common/dto/query.dto';

export class QueryMediaFolderDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  tagId?: string;
}
