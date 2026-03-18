import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateWhoWeAreDto {
  @IsString()
  @MinLength(20)
  @ApiProperty()
  content: string;
}
