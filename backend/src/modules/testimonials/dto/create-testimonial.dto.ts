import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty()
  role: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty()
  company: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  @ApiProperty()
  message: string;
}
