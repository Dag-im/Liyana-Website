import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../common/types/user-role.enum';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

type AuthenticatedRequest = {
  user: {
    sub: string;
    role: UserRole;
    divisionId: string | null;
  };
};

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Submit a booking request (public, no auth required)',
  })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input or inactive division.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Division or doctor does not exist.',
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary:
      'List bookings. ADMIN sees all, CUSTOMER_SERVICE sees own division only.',
  })
  @ApiResponse({ status: 200, description: 'Return paginated bookings.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. No division assigned or invalid role.',
  })
  findAll(@Query() query: QueryBookingDto, @Req() req: AuthenticatedRequest) {
    return this.bookingsService.findAll(query, req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Get booking details by ID' })
  @ApiResponse({ status: 200, description: 'Return booking details.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Ownership mismatch.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.bookingsService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update booking status and internal notes' })
  @ApiResponse({ status: 200, description: 'The status has been updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Ownership mismatch.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.updateStatus(id, updateStatusDto, req.user);
  }
}
