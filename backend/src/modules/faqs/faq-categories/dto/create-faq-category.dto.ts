import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength, Min } from 'class-validator';

export class CreateFaqCategoryDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
