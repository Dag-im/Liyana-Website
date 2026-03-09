import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  type ApiEnvelope,
  API_VERSION,
} from '../types/api-envelope.type';

type RequestWithId = {
  requestId?: string;
};

const STATUS_CODE_MAP: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_FAILED',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMITED',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
};

@Catch()
export class HttpExceptionEnvelopeFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<RequestWithId>();

    const requestId = request.requestId ?? randomUUID();
    const timestamp = new Date().toISOString();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: unknown;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const responsePayload = payload as {
          message?: string | string[];
          error?: string;
          details?: unknown;
        };

        if (Array.isArray(responsePayload.message)) {
          message = responsePayload.message.join(', ');
          details = responsePayload.message;
        } else {
          message = responsePayload.message ?? responsePayload.error ?? message;
        }

        if (responsePayload.details !== undefined) {
          details = responsePayload.details;
        }
      }
    }

    const body: ApiEnvelope<null> = {
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
        version: API_VERSION,
      },
    };

    response.status(statusCode).json(body);
  }
}
