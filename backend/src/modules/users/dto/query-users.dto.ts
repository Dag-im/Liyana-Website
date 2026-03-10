// src/modules/users/dto/query-user.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { UserRole } from '../../../common/types/user-role.enum';

export class QueryUserDto extends QueryDto {
  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  divisionId?: string;
}
