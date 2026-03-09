import { type INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { HttpExceptionEnvelopeFilter } from './common/filters/http-exception.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';

export function configureApp(app: INestApplication): void {
  app.enableCors();

  app.use(
    (
      req: { requestId?: string },
      res: { setHeader: (name: string, value: string) => void },
      next: () => void,
    ) => {
      const requestId = randomUUID();
      req.requestId = requestId;
      res.setHeader('x-request-id', requestId);
      next();
    },
  );

  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new HttpExceptionEnvelopeFilter());
}
