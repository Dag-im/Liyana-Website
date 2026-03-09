"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureApp = configureApp;
const node_crypto_1 = require("node:crypto");
const http_exception_envelope_filter_1 = require("./common/filters/http-exception-envelope.filter");
const response_envelope_interceptor_1 = require("./common/interceptors/response-envelope.interceptor");
function configureApp(app) {
    app.enableCors();
    app.use((req, res, next) => {
        const requestId = (0, node_crypto_1.randomUUID)();
        req.requestId = requestId;
        res.setHeader('x-request-id', requestId);
        next();
    });
    app.useGlobalInterceptors(new response_envelope_interceptor_1.ResponseEnvelopeInterceptor());
    app.useGlobalFilters(new http_exception_envelope_filter_1.HttpExceptionEnvelopeFilter());
}
//# sourceMappingURL=app.setup.js.map