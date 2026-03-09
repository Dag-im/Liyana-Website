"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = require("express");
const swagger_1 = require("@nestjs/swagger");
const node_crypto_1 = require("node:crypto");
const app_module_1 = require("./app.module");
const response_envelope_interceptor_1 = require("./common/interceptors/response-envelope.interceptor");
const http_exception_envelope_filter_1 = require("./common/filters/http-exception-envelope.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const nodeEnv = configService.getOrThrow('app.nodeEnv');
    const allowedOrigins = configService.getOrThrow('app.cors.allowedOrigins');
    const port = configService.getOrThrow('app.port');
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.use((req, res, next) => {
        const requestId = (0, node_crypto_1.randomUUID)();
        req.requestId = requestId;
        res.setHeader('x-request-id', requestId);
        next();
    });
    app.use((0, helmet_1.default)({
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
    app.use((0, cookie_parser_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, express_1.json)({ limit: '10mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '10mb' }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: nodeEnv === 'production',
    }));
    app.useGlobalInterceptors(new response_envelope_interceptor_1.ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new http_exception_envelope_filter_1.HttpExceptionEnvelopeFilter());
    app.setGlobalPrefix('api/v1');
    if (nodeEnv !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Liyana API')
            .setDescription('Production-grade API documentation')
            .setVersion('1.0.0')
            .addCookieAuth('Authentication', {
            type: 'apiKey',
            in: 'cookie',
        })
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map