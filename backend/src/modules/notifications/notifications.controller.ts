import {
  Controller,
  Get,
  Param,
  Patch,
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
import { QueryNotificationDto } from './dto/query-notification.dto';
import { NotificationsService } from './notifications.service';

type JwtRequest = {
  user: {
    sub: string;
    role: UserRole;
  };
};

@ApiTags('Notifications')
@ApiCookieAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unread-count')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Get unread notification count. Rate limit: 60 requests per 60 seconds.',
  })
  @ApiResponse({ status: 200, description: 'Returns unread count.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getUnreadCount(@Req() req: JwtRequest) {
    return this.notificationsService.getUnreadCount(req.user.role);
  }

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Get notifications for current user role. Rate limit: 60 requests per 60 seconds.',
  })
  @ApiResponse({ status: 200, description: 'List of notifications.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Req() req: JwtRequest, @Query() query: QueryNotificationDto) {
    return this.notificationsService.findForRole(req.user.role, query);
  }

  @Patch(':id/read')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({
    summary:
      'Mark notification as read. Rate limit: 30 requests per 60 seconds.',
  })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Role mismatch.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  markRead(@Param('id') id: string, @Req() req: JwtRequest) {
    return this.notificationsService.markRead(id, req.user.role);
  }
}
