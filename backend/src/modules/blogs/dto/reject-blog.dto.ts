import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RejectBlogDto {
  @IsString()
  @MinLength(10)
  @ApiProperty()
  rejectionReason!: string;
}
