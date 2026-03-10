import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BookingStatus } from '../entity/booking.entity';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({ required: false })
  notes?: string;
}
