import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { randomUUID } from 'node:crypto';

import {
  type ApiEnvelope,
  API_VERSION,
} from '../types/api-envelope.type';

type RequestWithId = {
  requestId?: string;
};

const isEnvelope = (value: unknown): value is ApiEnvelope<unknown> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    'success' in payload &&
    'data' in payload &&
    'error' in payload &&
    'meta' in payload
  );
};

@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ApiEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiEnvelope<T>> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const requestId = request.requestId ?? randomUUID();

    return next.handle().pipe(
      map((data) => {
        if (isEnvelope(data)) {
          return data as ApiEnvelope<T>;
        }

        return {
          success: true,
          data,
          error: null,
          meta: {
            requestId,
            timestamp: new Date().toISOString(),
            version: API_VERSION,
          },
        };
      }),
    );
  }
}
