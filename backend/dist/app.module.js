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
const audit_log_module_1 = require("./modules/audit-log/audit-log.module");
const auth_module_1 = require("./modules/auth/auth.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const blogs_module_1 = require("./modules/blogs/blogs.module");
const news_events_module_1 = require("./modules/news-events/news-events.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const services_module_1 = require("./modules/services/services.module");
const users_module_1 = require("./modules/users/users.module");
const uploads_module_1 = require("./uploads/uploads.module");
const corporate_network_module_1 = require("./modules/corporate-network/corporate-network.module");
const media_module_1 = require("./modules/media/media.module");
const team_module_1 = require("./modules/team/team.module");
const testimonials_module_1 = require("./modules/testimonials/testimonials.module");
const contact_module_1 = require("./modules/contact/contact.module");
const awards_module_1 = require("./modules/awards/awards.module");
const timeline_module_1 = require("./modules/timeline/timeline.module");
const faqs_module_1 = require("./modules/faqs/faqs.module");
const cms_module_1 = require("./modules/cms/cms.module");
const esg_module_1 = require("./modules/esg/esg.module");
const ir_module_1 = require("./modules/investor-relations/ir.module");
const lucs_module_1 = require("./modules/lucs/lucs.module");
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
                        ttl: configService.getOrThrow('app.throttle.ttlSeconds'),
                        limit: configService.getOrThrow('app.throttle.limit'),
                    },
                ],
            }),
            database_module_1.DatabaseModule,
            uploads_module_1.UploadsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            audit_log_module_1.AuditLogModule,
            notifications_module_1.NotificationsModule,
            services_module_1.ServicesModule,
            bookings_module_1.BookingsModule,
            news_events_module_1.NewsEventsModule,
            blogs_module_1.BlogsModule,
            corporate_network_module_1.CorporateNetworkModule,
            media_module_1.MediaModule,
            team_module_1.TeamModule,
            testimonials_module_1.TestimonialsModule,
            contact_module_1.ContactModule,
            awards_module_1.AwardsModule,
            timeline_module_1.TimelineModule,
            faqs_module_1.FaqsModule,
            cms_module_1.CmsModule,
            esg_module_1.EsgModule,
            ir_module_1.IrModule,
            lucs_module_1.LucsModule,
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
                useFactory: (reflector) => new common_1.ClassSerializerInterceptor(reflector),
                inject: [core_1.Reflector],
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