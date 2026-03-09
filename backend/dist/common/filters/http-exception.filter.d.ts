import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class HttpExceptionEnvelopeFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
