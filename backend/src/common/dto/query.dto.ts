import { IntersectionType } from '@nestjs/swagger';
import { FilterDto } from './filter.dto';
import { PaginationDto } from './pagination.dto';

export class QueryDto extends IntersectionType(PaginationDto, FilterDto) {}
