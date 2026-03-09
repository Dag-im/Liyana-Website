import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { type ApiEnvelope } from '../types/api-envelope.type';
export declare class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, ApiEnvelope<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiEnvelope<T>>;
}
