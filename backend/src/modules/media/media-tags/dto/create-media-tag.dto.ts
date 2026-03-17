import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMediaTagDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;
}
