import { PartialType } from '@nestjs/swagger';
import { CreateMediaItemDto } from './create-media-item.dto';

export class UpdateMediaItemDto extends PartialType(CreateMediaItemDto) {}
