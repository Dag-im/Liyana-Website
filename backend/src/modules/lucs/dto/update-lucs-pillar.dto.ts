import { PartialType } from '@nestjs/swagger';
import { CreateLucsPillarDto } from './create-lucs-pillar.dto';

export class UpdateLucsPillarDto extends PartialType(CreateLucsPillarDto) {}
