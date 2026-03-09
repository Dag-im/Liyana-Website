import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const forwardedForHeader = req.headers?.['x-forwarded-for'];
    const forwardedFor = Array.isArray(forwardedForHeader)
      ? forwardedForHeader[0]
      : forwardedForHeader;

    if (typeof forwardedFor === 'string' && forwardedFor.trim().length > 0) {
      const firstIp = forwardedFor.split(',')[0]?.trim();
      if (firstIp) {
        return firstIp;
      }
    }

    if (Array.isArray(req.ips) && req.ips.length > 0) {
      return req.ips[0];
    }

    return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
  }
}
