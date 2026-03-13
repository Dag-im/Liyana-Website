import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MinLength(5)
  @ApiProperty()
  title!: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  excerpt!: string;

  @IsString()
  @MinLength(50)
  @ApiProperty()
  content!: string;

  @IsString()
  @ApiProperty()
  image!: string;

  @IsUUID()
  @ApiProperty()
  categoryId!: string;
}
