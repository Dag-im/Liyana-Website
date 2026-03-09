import { Injectable, Logger } from '@nestjs/common';

import { AuditAction } from '../enums/audit-action.enum';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  log(
    action: AuditAction,
    performedBy: string,
    targetId: string,
    meta?: Record<string, unknown>,
  ): void {
    this.logger.log(
      JSON.stringify({
        action,
        performedBy,
        targetId,
        meta: meta ?? {},
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
