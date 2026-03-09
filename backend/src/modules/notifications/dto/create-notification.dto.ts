import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { NotificationUrgency } from '../../../common/types/notification-urgency.enum';
import { UserRole } from '../../../common/types/user-role.enum';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  message!: string;

  @ApiProperty({
    enum: NotificationUrgency,
    required: false,
    default: NotificationUrgency.LOW,
  })
  @IsOptional()
  @IsEnum(NotificationUrgency)
  urgency?: NotificationUrgency = NotificationUrgency.LOW;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  targetRole!: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  relatedEntityId?: string;
}
