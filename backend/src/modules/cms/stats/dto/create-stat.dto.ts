import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateStatDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  label: string;

  @IsInt()
  @Min(0)
  @ApiProperty()
  value: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  suffix?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
