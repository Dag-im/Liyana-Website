import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { BookingStatus, SelectionType } from '../entity/booking.entity';

export class QueryBookingDto extends QueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  @ApiPropertyOptional({ enum: BookingStatus })
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(SelectionType)
  @ApiPropertyOptional({ enum: SelectionType })
  selectionType?: SelectionType;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  divisionId?: string;
}
