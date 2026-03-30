import { PartialType } from '@nestjs/swagger';
import { CreateEsgPillarDto } from './create-esg-pillar.dto';

export class UpdateEsgPillarDto extends PartialType(CreateEsgPillarDto) {}
