import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateMediaFolderDto {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  coverImage: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;

  @IsUUID()
  @ApiProperty()
  tagId: string;
}
