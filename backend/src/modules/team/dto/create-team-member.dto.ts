import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  position: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  bio: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  image?: string;

  @IsBoolean()
  @ApiProperty()
  isCorporate: boolean;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ required: false })
  divisionId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}
