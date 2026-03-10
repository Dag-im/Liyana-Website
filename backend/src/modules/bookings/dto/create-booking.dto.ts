import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SelectionType } from '../entity/booking.entity';

export class CreateBookingDto {
  @IsUUID()
  @ApiProperty()
  divisionId: string;

  @IsEnum(SelectionType)
  @ApiProperty({ enum: SelectionType })
  selectionType: SelectionType;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  selectionId?: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  selectionLabel: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  patientName: string;

  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @ApiProperty()
  patientPhone: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ required: false })
  patientEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({ required: false })
  notes?: string;
}
