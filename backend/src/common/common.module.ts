import { Module } from '@nestjs/common';

import { AuditLogModule } from '../modules/audit-log/audit-log.module';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';

@Module({
  // We export AuditLogModule instead of providing AuditLogService
  // so that the Provider list relies on exactly one instance globally.
  imports: [AuditLogModule],
  providers: [OptionalJwtAuthGuard],
  exports: [AuditLogModule, OptionalJwtAuthGuard],
})
export class CommonModule {}
