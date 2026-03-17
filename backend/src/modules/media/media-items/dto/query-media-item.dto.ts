import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { QueryDto } from '../../../../common/dto/query.dto';
import { MediaItemType } from '../../entities/media-item.entity';

export class QueryMediaItemDto extends QueryDto {
  @IsOptional()
  @IsEnum(MediaItemType)
  @ApiPropertyOptional({ enum: MediaItemType })
  type?: MediaItemType;
}
