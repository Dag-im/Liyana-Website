import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UploadsModule } from '../../uploads/uploads.module';
import { IrController } from './ir.controller';
import { IrService } from './ir.service';
import { IrContact } from './entities/ir-contact.entity';
import { IrDocument } from './entities/ir-document.entity';
import { IrFinancialCell } from './entities/ir-financial-cell.entity';
import { IrFinancialColumn } from './entities/ir-financial-column.entity';
import { IrFinancialRow } from './entities/ir-financial-row.entity';
import { IrHero } from './entities/ir-hero.entity';
import { IrInquiry } from './entities/ir-inquiry.entity';
import { IrKpi } from './entities/ir-kpi.entity';
import { IrStrategy } from './entities/ir-strategy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IrHero,
      IrStrategy,
      IrContact,
      IrKpi,
      IrFinancialColumn,
      IrFinancialRow,
      IrFinancialCell,
      IrDocument,
      IrInquiry,
    ]),
    CommonModule,
    UploadsModule,
    NotificationsModule,
  ],
  providers: [IrService],
  controllers: [IrController],
  exports: [IrService],
})
export class IrModule {}
