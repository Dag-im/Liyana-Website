import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.getOrThrow<string>('app.nodeEnv');
  const allowedOrigins = configService.getOrThrow<string[]>('app.cors.allowedOrigins');
  const port = configService.getOrThrow<number>('app.port');

  const trustProxyDepth = configService.getOrThrow<number>('app.trustProxyDepth');
  const cookieSecret = configService.getOrThrow<string>('app.cookieSecret');

  app.getHttpAdapter().getInstance().set('trust proxy', trustProxyDepth);

  app.use((req: { requestId?: string }, res: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    const requestId = randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  });

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    hsts: {
      maxAge: 15552000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser(cookieSecret));
  app.use(compression());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const flattenErrors = (errorList: any[], parentField = ''): { field: string; error: string }[] => {
          return errorList.reduce((acc, error) => {
            const field = parentField ? `${parentField}.${error.property}` : error.property;
            if (error.constraints) {
              acc.push(...Object.keys(error.constraints).map((key) => ({ field, error: key })));
            }
            if (error.children && error.children.length > 0) {
              acc.push(...flattenErrors(error.children, field));
            }
            return acc;
          }, []);
        };

        return new BadRequestException(flattenErrors(errors));
      },
    }),
  );

  // Global Interceptors and Filters are now registered in AppModule for DI support

  app.setGlobalPrefix('api/v1');

  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Liyana API')
      .setDescription('Production-grade API documentation')
      .setVersion('1.0.0')
      .addCookieAuth('Authentication', {
        type: 'apiKey',
        in: 'cookie',
      })
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
}
bootstrap();
