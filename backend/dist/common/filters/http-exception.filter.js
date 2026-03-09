"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionEnvelopeFilter = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const api_envelope_type_1 = require("../types/api-envelope.type");
const STATUS_CODE_MAP = {
    [common_1.HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
    [common_1.HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
    [common_1.HttpStatus.FORBIDDEN]: 'FORBIDDEN',
    [common_1.HttpStatus.NOT_FOUND]: 'NOT_FOUND',
    [common_1.HttpStatus.CONFLICT]: 'CONFLICT',
    [common_1.HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_FAILED',
    [common_1.HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMITED',
    [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};
let HttpExceptionEnvelopeFilter = class HttpExceptionEnvelopeFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.requestId ?? (0, node_crypto_1.randomUUID)();
        const timestamp = new Date().toISOString();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const payload = exception.getResponse();
            if (typeof payload === 'string') {
                message = payload;
            }
            else if (payload && typeof payload === 'object') {
                const responsePayload = payload;
                if (Array.isArray(responsePayload.message)) {
                    message = responsePayload.message.join(', ');
                    details = responsePayload.message;
                }
                else {
                    message = responsePayload.message ?? responsePayload.error ?? message;
                }
                if (responsePayload.details !== undefined) {
                    details = responsePayload.details;
                }
            }
        }
        const body = {
            success: false,
            data: null,
            error: {
                code: STATUS_CODE_MAP[statusCode] ?? `HTTP_${statusCode}`,
                message,
                ...(details !== undefined ? { details } : {}),
                traceId: requestId,
            },
            meta: {
                requestId,
                timestamp,
                version: api_envelope_type_1.API_VERSION,
            },
        };
        response.status(statusCode).json(body);
    }
};
exports.HttpExceptionEnvelopeFilter = HttpExceptionEnvelopeFilter;
exports.HttpExceptionEnvelopeFilter = HttpExceptionEnvelopeFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionEnvelopeFilter);
//# sourceMappingURL=http-exception.filter.js.map