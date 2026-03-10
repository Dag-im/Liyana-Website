import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.getOrThrow<string>('app.db.host'),
        port: configService.getOrThrow<number>('app.db.port'),
        username: configService.getOrThrow<string>('app.db.username'),
        password: configService.getOrThrow<string>('app.db.password'),
        database: configService.getOrThrow<string>('app.db.name'),
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        extra: {
          connectionLimit: 10,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
