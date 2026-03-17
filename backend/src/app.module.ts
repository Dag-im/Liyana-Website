import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  Reflector,
} from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionEnvelopeFilter } from './common/filters/http-exception-envelope.filter';
import { AppThrottlerGuard } from './common/guards/throttler.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import appConfig from './config/config';
import { DatabaseModule } from './database/database.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { NewsEventsModule } from './modules/news-events/news-events.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './uploads/uploads.module';
import { CorporateNetworkModule } from './modules/corporate-network/corporate-network.module';
import { MediaModule } from './modules/media/media.module';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('app.throttle.ttlSeconds'),
          limit: configService.getOrThrow<number>('app.throttle.limit'),
        },
      ],
    }),
    DatabaseModule,
    UploadsModule,
    UsersModule,
    AuthModule,
    AuditLogModule,
    NotificationsModule,
    ServicesModule,
    BookingsModule,
    NewsEventsModule,
    BlogsModule,
    CorporateNetworkModule,
    MediaModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
    {
      /*
       * Interceptor ordering is intentional:
       * 1. LoggingInterceptor - basic request/response logs
       * 2. ClassSerializerInterceptor - applies @Exclude() transformations
       * 3. ResponseEnvelopeInterceptor - wraps result in standard API envelope
       * This ensures @Exclude() is applied BEFORE the envelope wraps the data.
       */
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionEnvelopeFilter,
    },
  ],
})
export class AppModule {}
