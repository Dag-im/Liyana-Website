import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryTestimonialPublicDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'ISO timestamp cursor — createdAt of last item from previous page',
    example: '2024-03-10T08:15:45.000Z',
  })
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'Number of items to return per page',
    default: 12,
    minimum: 1,
    maximum: 50,
  })
  limit?: number;
}
