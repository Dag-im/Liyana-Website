import { PartialType } from '@nestjs/swagger';
import { CreateTimelineItemDto } from './create-timeline-item.dto';

export class UpdateTimelineItemDto extends PartialType(CreateTimelineItemDto) {}
