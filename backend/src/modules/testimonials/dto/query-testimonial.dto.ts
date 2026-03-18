import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';

export class QueryTestimonialDto extends QueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiPropertyOptional()
  isApproved?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiPropertyOptional()
  isFavorite?: boolean;
}
