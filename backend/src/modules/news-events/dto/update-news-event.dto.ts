import { PartialType } from '@nestjs/swagger';
import { CreateNewsEventDto } from './create-news-event.dto';

export class UpdateNewsEventDto extends PartialType(CreateNewsEventDto) {}

