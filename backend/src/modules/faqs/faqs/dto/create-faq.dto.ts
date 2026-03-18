import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MinLength(5)
  @ApiProperty()
  question: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  answer: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  position?: number;

  @IsUUID()
  @ApiProperty()
  categoryId: string;
}
