import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { QueryDto } from '../../../common/dto/query.dto';
import { NewsEventStatus, NewsEventType } from '../entity/news-event.entity';

export class QueryNewsEventDto extends QueryDto {
  @IsOptional()
  @IsEnum(NewsEventType)
  @ApiPropertyOptional({ enum: NewsEventType })
  type?: NewsEventType;

  @IsOptional()
  @IsEnum(NewsEventStatus)
  @ApiPropertyOptional({ enum: NewsEventStatus })
  status?: NewsEventStatus;
}
