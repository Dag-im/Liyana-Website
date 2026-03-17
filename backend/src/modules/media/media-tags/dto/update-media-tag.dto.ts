import { PartialType } from '@nestjs/swagger';
import { CreateMediaTagDto } from './create-media-tag.dto';

export class UpdateMediaTagDto extends PartialType(CreateMediaTagDto) {}
