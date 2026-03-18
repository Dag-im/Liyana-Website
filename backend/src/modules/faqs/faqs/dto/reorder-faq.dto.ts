import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ReorderFaqDto {
  @IsInt()
  @Min(0)
  @ApiProperty()
  position: number;
}
