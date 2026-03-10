import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateDoctorDto } from '../../doctors/dto/create-doctor.dto';

export class StatDto {
  @IsString()
  @ApiProperty()
  label: string;

  @IsString()
  @ApiProperty()
  value: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false })
  sortOrder?: number;
}

export class ContactDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  address?: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ required: false })
  googleMap?: string;
}

export class CreateDivisionDto {
  @IsUUID()
  @ApiProperty()
  serviceCategoryId: string;

  @IsUUID()
  @ApiProperty()
  divisionCategoryId: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase alphanumeric and hyphens only',
  })
  @ApiProperty()
  slug: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  shortName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  location?: string;

  @IsString()
  @MinLength(10)
  @ApiProperty()
  overview: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  logo?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  description: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  groupPhoto?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ required: false, type: [String] })
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  coreServices: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  @ApiProperty({ required: false, type: [StatDto] })
  stats?: StatDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDoctorDto)
  @ApiProperty({ required: false, type: [CreateDoctorDto] })
  doctors?: CreateDoctorDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  @ApiProperty({ required: false })
  contact?: ContactDto;
}
