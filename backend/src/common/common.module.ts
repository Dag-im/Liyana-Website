import { Module } from '@nestjs/common';

import { AuditLogModule } from '../modules/audit-log/audit-log.module';

@Module({
  // We export AuditLogModule instead of providing AuditLogService
  // so that the Provider list relies on exactly one instance globally.
  imports: [AuditLogModule],
  exports: [AuditLogModule],
})
export class CommonModule {}
