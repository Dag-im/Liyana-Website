import { PartialType } from '@nestjs/swagger';
import { CreateCoreValueDto } from './create-core-value.dto';

export class UpdateCoreValueDto extends PartialType(CreateCoreValueDto) {}
