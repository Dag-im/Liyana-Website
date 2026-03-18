import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateMissionVisionDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @ApiProperty({ required: false })
  missionTitle?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @ApiProperty({ required: false })
  missionDescription?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  missionIcon?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @ApiProperty({ required: false })
  visionTitle?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @ApiProperty({ required: false })
  visionDescription?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  visionIcon?: string;
}
