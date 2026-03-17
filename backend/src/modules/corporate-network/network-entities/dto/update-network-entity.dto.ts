import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateNetworkEntityDto } from './create-network-entity.dto';

export class UpdateNetworkEntityDto extends PartialType(
  OmitType(CreateNetworkEntityDto, ['parentId'] as const),
) {}
