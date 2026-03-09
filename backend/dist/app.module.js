"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const http_exception_envelope_filter_1 = require("./common/filters/http-exception-envelope.filter");
const throttler_guard_1 = require("./common/guards/throttler.guard");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const response_envelope_interceptor_1 = require("./common/interceptors/response-envelope.interceptor");
const config_2 = __importDefault(require("./config/config"));
const database_module_1 = require("./database/database.module");
const uploads_module_1 = require("./uploads/uploads.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                load: [config_2.default],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => [
                    {
                        ttl: configService.getOrThrow('app.throttle.ttlSeconds') * 1000,
                        limit: configService.getOrThrow('app.throttle.limit'),
                    },
                ],
            }),
            database_module_1.DatabaseModule,
            uploads_module_1.UploadsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_guard_1.AppThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_envelope_interceptor_1.ResponseEnvelopeInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_envelope_filter_1.HttpExceptionEnvelopeFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map