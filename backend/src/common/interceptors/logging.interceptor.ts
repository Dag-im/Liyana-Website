import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, requestId } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;
        const sanitizedUrl = this.sanitizeUrl(url);

        this.logger.log(
          `[${requestId}] ${method} ${sanitizedUrl} ${statusCode} - ${duration}ms`,
        );
      }),
    );
  }

  private sanitizeUrl(url: string): string {
    try {
      const [path, queryString] = url.split('?');
      if (!queryString) return path;

      const params = new URLSearchParams(queryString);
      const allowedParams = new Set(['page', 'limit', 'sort', 'search', 'filter']);
      const sanitizedParams = new URLSearchParams();

      params.forEach((value, key) => {
        if (allowedParams.has(key)) {
          sanitizedParams.append(key, value);
        } else {
          sanitizedParams.append(key, '[REDACTED]');
        }
      });

      const sanitizedQuery = sanitizedParams.toString();
      return sanitizedQuery ? `${path}?${sanitizedQuery}` : path;
    } catch {
      return url;
    }
  }
}
