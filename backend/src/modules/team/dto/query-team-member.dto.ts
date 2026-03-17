import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';

export class QueryTeamMemberDto extends QueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  divisionId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiPropertyOptional()
  isCorporate?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiPropertyOptional()
  includeHidden?: boolean;
}
