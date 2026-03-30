import { PartialType } from '@nestjs/swagger';
import { CreateEsgGovernanceItemDto } from './create-esg-governance-item.dto';

export class UpdateEsgGovernanceItemDto extends PartialType(
  CreateEsgGovernanceItemDto,
) {}
