import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  specialty: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  image?: string;

  @IsString()
  @ApiProperty()
  availability: string;
}
