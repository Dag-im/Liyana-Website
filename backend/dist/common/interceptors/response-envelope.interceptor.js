"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseEnvelopeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const node_crypto_1 = require("node:crypto");
const api_envelope_type_1 = require("../types/api-envelope.type");
const isEnvelope = (value) => {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const payload = value;
    return ('success' in payload &&
        'data' in payload &&
        'error' in payload &&
        'meta' in payload);
};
let ResponseEnvelopeInterceptor = class ResponseEnvelopeInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const requestId = request.requestId ?? (0, node_crypto_1.randomUUID)();
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            if (isEnvelope(data)) {
                return data;
            }
            return {
                success: true,
                data,
                error: null,
                meta: {
                    requestId,
                    timestamp: new Date().toISOString(),
                    version: api_envelope_type_1.API_VERSION,
                },
            };
        }));
    }
};
exports.ResponseEnvelopeInterceptor = ResponseEnvelopeInterceptor;
exports.ResponseEnvelopeInterceptor = ResponseEnvelopeInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseEnvelopeInterceptor);
//# sourceMappingURL=response-envelope.interceptor.js.map