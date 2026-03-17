import { PartialType } from '@nestjs/swagger';
import { CreateNetworkRelationDto } from './create-network-relation.dto';

export class UpdateNetworkRelationDto extends PartialType(
  CreateNetworkRelationDto,
) {}
