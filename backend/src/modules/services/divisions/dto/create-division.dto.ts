import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

export class ImageDto {
  @IsString()
  @ApiProperty()
  path: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  alt?: string;
}

export class CoreServiceDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;
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
  @IsBoolean()
  @ApiProperty({ required: false })
  isActive?: boolean;

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
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @ApiProperty({ required: false, type: [ImageDto] })
  images?: ImageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoreServiceDto)
  @ApiProperty({ type: [CoreServiceDto] })
  coreServices: CoreServiceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  @ApiProperty({ required: false, type: [StatDto] })
  stats?: StatDto[];



  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  @ApiProperty({ required: false })
  contact?: ContactDto;
}
