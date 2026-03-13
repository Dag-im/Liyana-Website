import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { BlogStatus } from '../entities/blog.entity';

export class QueryBlogDto extends QueryDto {
  @IsOptional()
  @IsEnum(BlogStatus)
  @ApiPropertyOptional({ enum: BlogStatus })
  status?: BlogStatus;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  authorId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiPropertyOptional()
  featured?: boolean;
}
