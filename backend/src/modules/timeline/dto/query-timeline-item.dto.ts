import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { TimelineCategory } from '../entity/timeline-item.entity';

export class QueryTimelineItemDto extends QueryDto {
  @IsOptional()
  @IsEnum(TimelineCategory)
  @ApiPropertyOptional({ enum: TimelineCategory })
  category?: TimelineCategory;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  year?: string;
}
