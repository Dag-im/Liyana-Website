import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name!: string;
}
