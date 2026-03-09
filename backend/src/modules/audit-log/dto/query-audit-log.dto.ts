import { IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { FilterDto } from '../../../common/dto/filter.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../../../common/enums/audit-action.enum';

export class QueryAuditLogDto extends IntersectionType(
  PaginationDto,
  FilterDto,
) {
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  performedBy?: string;
}
