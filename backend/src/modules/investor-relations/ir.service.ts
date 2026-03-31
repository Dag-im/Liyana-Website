import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { NotificationUrgency } from '../../common/types/notification-urgency.enum';
import { UserRole } from '../../common/types/user-role.enum';
import { UploadsService } from '../../uploads/uploads.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateIrDocumentDto } from './dto/create-ir-document.dto';
import { CreateIrFinancialColumnDto } from './dto/create-ir-financial-column.dto';
import { CreateIrFinancialRowDto } from './dto/create-ir-financial-row.dto';
import { CreateIrInquiryDto } from './dto/create-ir-inquiry.dto';
import { CreateIrKpiDto } from './dto/create-ir-kpi.dto';
import { QueryIrInquiryDto } from './dto/query-ir-inquiry.dto';
import { UpdateIrContactDto } from './dto/update-ir-contact.dto';
import { UpdateIrDocumentDto } from './dto/update-ir-document.dto';
import { UpdateIrFinancialColumnDto } from './dto/update-ir-financial-column.dto';
import { UpdateIrFinancialRowDto } from './dto/update-ir-financial-row.dto';
import { UpdateIrHeroDto } from './dto/update-ir-hero.dto';
import { UpdateIrKpiDto } from './dto/update-ir-kpi.dto';
import { UpdateIrStrategyDto } from './dto/update-ir-strategy.dto';
import { IrContact } from './entities/ir-contact.entity';
import { IrDocument } from './entities/ir-document.entity';
import { IrFinancialCell } from './entities/ir-financial-cell.entity';
import { IrFinancialColumn } from './entities/ir-financial-column.entity';
import { IrFinancialPeriodType, IrFinancialRow } from './entities/ir-financial-row.entity';
import { IrHero } from './entities/ir-hero.entity';
import { IrInquiry } from './entities/ir-inquiry.entity';
import { IrKpi } from './entities/ir-kpi.entity';
import { IrStrategy } from './entities/ir-strategy.entity';

type JwtUser = {
  sub: string;
  role: UserRole;
};

@Injectable()
export class IrService {
  constructor(
    @InjectRepository(IrHero)
    private readonly heroRepo: Repository<IrHero>,
    @InjectRepository(IrStrategy)
    private readonly strategyRepo: Repository<IrStrategy>,
    @InjectRepository(IrContact)
    private readonly contactRepo: Repository<IrContact>,
    @InjectRepository(IrKpi)
    private readonly kpiRepo: Repository<IrKpi>,
    @InjectRepository(IrFinancialColumn)
    private readonly columnRepo: Repository<IrFinancialColumn>,
    @InjectRepository(IrFinancialRow)
    private readonly rowRepo: Repository<IrFinancialRow>,
    @InjectRepository(IrFinancialCell)
    private readonly cellRepo: Repository<IrFinancialCell>,
    @InjectRepository(IrDocument)
    private readonly documentRepo: Repository<IrDocument>,
    @InjectRepository(IrInquiry)
    private readonly inquiryRepo: Repository<IrInquiry>,
    private readonly dataSource: DataSource,
    private readonly auditLogService: AuditLogService,
    private readonly uploadsService: UploadsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findHero() {
    const hero = await this.findHeroAdmin();
    return hero.isPublished ? hero : null;
  }

  async findHeroAdmin() {
    return this.findOrCreateSingleton(this.heroRepo, {
      id: 'singleton',
      tagline: 'Investing in the Future of Healthcare',
      subtitle: '',
      isPublished: false,
    });
  }

  async updateHero(dto: UpdateIrHeroDto, performedBy: string) {
    const hero = await this.findHeroAdmin();
    this.heroRepo.merge(hero, dto);
    const saved = await this.heroRepo.save(hero);
    this.auditLogService.log(AuditAction.IR_HERO_UPDATED, performedBy, saved.id);
    return saved;
  }

  async publishHero() {
    const hero = await this.findHeroAdmin();
    hero.isPublished = true;
    return this.heroRepo.save(hero);
  }

  async unpublishHero() {
    const hero = await this.findHeroAdmin();
    hero.isPublished = false;
    return this.heroRepo.save(hero);
  }

  async findStrategy() {
    const strategy = await this.findStrategyAdmin();
    return strategy.isPublished ? strategy : null;
  }

  async findStrategyAdmin() {
    return this.findOrCreateSingleton(this.strategyRepo, {
      id: 'singleton',
      content: '',
      isPublished: false,
    });
  }

  async updateStrategy(dto: UpdateIrStrategyDto, performedBy: string) {
    const strategy = await this.findStrategyAdmin();
    this.strategyRepo.merge(strategy, dto);
    const saved = await this.strategyRepo.save(strategy);
    this.auditLogService.log(
      AuditAction.IR_STRATEGY_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async publishStrategy() {
    const strategy = await this.findStrategyAdmin();
    strategy.isPublished = true;
    return this.strategyRepo.save(strategy);
  }

  async unpublishStrategy() {
    const strategy = await this.findStrategyAdmin();
    strategy.isPublished = false;
    return this.strategyRepo.save(strategy);
  }

  async findContact() {
    const contact = await this.findContactAdmin();
    return contact.isPublished ? contact : null;
  }

  async findContactAdmin() {
    return this.findOrCreateSingleton(this.contactRepo, {
      id: 'singleton',
      email: '',
      phone: null,
      address: null,
      description: null,
      isPublished: false,
    });
  }

  async updateContact(dto: UpdateIrContactDto, performedBy: string) {
    const contact = await this.findContactAdmin();
    this.contactRepo.merge(contact, {
      ...dto,
      ...(dto.phone !== undefined ? { phone: dto.phone ?? null } : {}),
      ...(dto.address !== undefined ? { address: dto.address ?? null } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description ?? null }
        : {}),
    });
    const saved = await this.contactRepo.save(contact);
    this.auditLogService.log(AuditAction.IR_CONTACT_UPDATED, performedBy, saved.id);
    return saved;
  }

  async publishContact() {
    const contact = await this.findContactAdmin();
    contact.isPublished = true;
    return this.contactRepo.save(contact);
  }

  async unpublishContact() {
    const contact = await this.findContactAdmin();
    contact.isPublished = false;
    return this.contactRepo.save(contact);
  }

  async findAllKpis(user?: JwtUser | null) {
    return this.kpiRepo.find({
      where: this.canViewUnpublished(user) ? {} : { isPublished: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createKpi(dto: CreateIrKpiDto, performedBy: string) {
    const kpi = this.kpiRepo.create({
      ...dto,
      suffix: dto.suffix ?? null,
      sortOrder: dto.sortOrder ?? 0,
    });
    const saved = await this.kpiRepo.save(kpi);
    this.auditLogService.log(AuditAction.IR_KPI_CREATED, performedBy, saved.id);
    return saved;
  }

  async updateKpi(id: string, dto: UpdateIrKpiDto, performedBy: string) {
    const kpi = await this.findKpi(id);
    this.kpiRepo.merge(kpi, {
      ...dto,
      ...(dto.suffix !== undefined ? { suffix: dto.suffix ?? null } : {}),
    });
    const saved = await this.kpiRepo.save(kpi);
    this.auditLogService.log(AuditAction.IR_KPI_UPDATED, performedBy, saved.id);
    return saved;
  }

  async publishKpi(id: string) {
    const kpi = await this.findKpi(id);
    kpi.isPublished = true;
    return this.kpiRepo.save(kpi);
  }

  async unpublishKpi(id: string) {
    const kpi = await this.findKpi(id);
    kpi.isPublished = false;
    return this.kpiRepo.save(kpi);
  }

  async removeKpi(id: string, performedBy: string) {
    const kpi = await this.findKpi(id);
    await this.kpiRepo.remove(kpi);
    this.auditLogService.log(AuditAction.IR_KPI_DELETED, performedBy, id);
    return { message: 'IR KPI deleted successfully' };
  }

  async findAllFinancialColumns() {
    return this.columnRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async createFinancialColumn(dto: CreateIrFinancialColumnDto) {
    const column = this.columnRepo.create({
      ...dto,
      sortOrder: dto.sortOrder ?? 0,
    });
    return this.columnRepo.save(column);
  }

  async updateFinancialColumn(id: string, dto: UpdateIrFinancialColumnDto) {
    const column = await this.findFinancialColumn(id);
    this.columnRepo.merge(column, dto);
    return this.columnRepo.save(column);
  }

  async removeFinancialColumn(id: string) {
    const column = await this.findFinancialColumn(id);
    await this.columnRepo.remove(column);
    return { message: 'IR financial column deleted successfully' };
  }

  async getFinancialTable(user?: JwtUser | null) {
    const columns = await this.columnRepo.find({
      order: { sortOrder: 'ASC' },
    });
    const rows = await this.rowRepo.find({
      where: this.canViewUnpublished(user) ? {} : { isPublished: true },
      relations: ['cells', 'cells.column'],
      order: { sortOrder: 'ASC', cells: { column: { sortOrder: 'ASC' } } },
    });
    return { columns, rows };
  }

  async createFinancialRow(dto: CreateIrFinancialRowDto, performedBy: string) {
    const saved = await this.dataSource.transaction(async (manager) => {
      await this.ensureColumnsExist(dto.cells.map((cell) => cell.columnId), manager);

      const row = manager.create(IrFinancialRow, {
        period: dto.period,
        periodType: dto.periodType,
        sortOrder: dto.sortOrder ?? 0,
      });
      const savedRow = await manager.save(IrFinancialRow, row);

      const cells = dto.cells.map((cell) =>
        manager.create(IrFinancialCell, {
          rowId: savedRow.id,
          columnId: cell.columnId,
          value: cell.value,
        }),
      );
      await manager.save(IrFinancialCell, cells);

      return manager.findOneOrFail(IrFinancialRow, {
        where: { id: savedRow.id },
        relations: ['cells', 'cells.column'],
      });
    });

    this.auditLogService.log(
      AuditAction.IR_FINANCIAL_ROW_CREATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async updateFinancialRow(
    id: string,
    dto: UpdateIrFinancialRowDto,
    performedBy: string,
  ) {
    const saved = await this.dataSource.transaction(async (manager) => {
      const row = await manager.findOne(IrFinancialRow, {
        where: { id },
        relations: ['cells'],
      });

      if (!row) {
        throw new NotFoundException('IR financial row not found');
      }

      if (dto.cells) {
        await this.ensureColumnsExist(dto.cells.map((cell) => cell.columnId), manager);
      }

      manager.merge(IrFinancialRow, row, dto);
      const savedRow = await manager.save(IrFinancialRow, row);

      if (dto.cells) {
        await manager.delete(IrFinancialCell, { rowId: id });
        if (dto.cells.length > 0) {
          const cells = dto.cells.map((cell) =>
            manager.create(IrFinancialCell, {
              rowId: id,
              columnId: cell.columnId,
              value: cell.value,
            }),
          );
          await manager.save(IrFinancialCell, cells);
        }
      }

      return manager.findOneOrFail(IrFinancialRow, {
        where: { id: savedRow.id },
        relations: ['cells', 'cells.column'],
      });
    });

    this.auditLogService.log(
      AuditAction.IR_FINANCIAL_ROW_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async publishFinancialRow(id: string) {
    const row = await this.findFinancialRow(id);
    row.isPublished = true;
    return this.rowRepo.save(row);
  }

  async unpublishFinancialRow(id: string) {
    const row = await this.findFinancialRow(id);
    row.isPublished = false;
    return this.rowRepo.save(row);
  }

  async removeFinancialRow(id: string, performedBy: string) {
    const row = await this.findFinancialRow(id);
    await this.rowRepo.remove(row);
    this.auditLogService.log(
      AuditAction.IR_FINANCIAL_ROW_DELETED,
      performedBy,
      id,
    );
    return { message: 'IR financial row deleted successfully' };
  }

  async findAllDocuments(user?: JwtUser | null) {
    return this.documentRepo.find({
      where: this.canViewUnpublished(user) ? {} : { isPublished: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createDocument(dto: CreateIrDocumentDto, performedBy: string) {
    const saved = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'ir-document',
      async () => {
        const document = this.documentRepo.create({
          ...dto,
          sortOrder: dto.sortOrder ?? 0,
        });
        return this.documentRepo.save(document);
      },
    );
    this.auditLogService.log(
      AuditAction.IR_DOCUMENT_CREATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async updateDocument(id: string, dto: UpdateIrDocumentDto, performedBy: string) {
    const document = await this.findDocument(id);
    const saved = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'ir-document',
      async () => {
        const previousFile =
          dto.filePath && dto.filePath !== document.filePath
            ? document.filePath
            : null;
        this.documentRepo.merge(document, dto);
        const updated = await this.documentRepo.save(document);
        if (previousFile) {
          await this.uploadsService.delete(previousFile);
        }
        return updated;
      },
    );
    this.auditLogService.log(
      AuditAction.IR_DOCUMENT_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async publishDocument(id: string) {
    const document = await this.findDocument(id);
    document.isPublished = true;
    return this.documentRepo.save(document);
  }

  async unpublishDocument(id: string) {
    const document = await this.findDocument(id);
    document.isPublished = false;
    return this.documentRepo.save(document);
  }

  async removeDocument(id: string, performedBy: string) {
    const document = await this.findDocument(id);
    await this.uploadsService.delete(document.filePath);
    await this.documentRepo.remove(document);
    this.auditLogService.log(
      AuditAction.IR_DOCUMENT_DELETED,
      performedBy,
      id,
    );
    return { message: 'IR document deleted successfully' };
  }

  async createInquiry(dto: CreateIrInquiryDto) {
    const inquiry = this.inquiryRepo.create({
      ...dto,
      isReviewed: false,
    });
    const saved = await this.inquiryRepo.save(inquiry);

    void this.notificationsService.createForRoles(
      [UserRole.ADMIN, UserRole.COMMUNICATION],
      {
        title: 'New Investor Relations Inquiry',
        message: `${saved.name} (${saved.email}) submitted a new investor inquiry requiring review.`,
        urgency: NotificationUrgency.MEDIUM,
        relatedEntityType: 'ir',
        relatedEntityId: saved.id,
      },
      'system',
    );

    this.auditLogService.log(
      AuditAction.IR_INQUIRY_SUBMITTED,
      'public',
      saved.id,
    );

    return saved;
  }

  async findAllInquiries(queryDto: QueryIrInquiryDto) {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 10;
    const query = this.inquiryRepo.createQueryBuilder('inquiry');

    query.where('inquiry.deletedAt IS NULL');

    if (queryDto.isReviewed !== undefined) {
      query.andWhere('inquiry.isReviewed = :isReviewed', {
        isReviewed: queryDto.isReviewed,
      });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('inquiry.name LIKE :search', { search }).orWhere(
            'inquiry.email LIKE :search',
            { search },
          );
        }),
      );
    }

    query
      .orderBy('inquiry.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, perPage };
  }

  async findInquiry(id: string) {
    const inquiry = await this.inquiryRepo.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!inquiry) {
      throw new NotFoundException('IR inquiry not found');
    }

    return inquiry;
  }

  async reviewInquiry(id: string, performedBy: string) {
    const inquiry = await this.findInquiry(id);

    if (inquiry.isReviewed) {
      throw new BadRequestException('Already marked as reviewed');
    }

    inquiry.isReviewed = true;
    inquiry.reviewedAt = new Date();
    const saved = await this.inquiryRepo.save(inquiry);

    this.auditLogService.log(
      AuditAction.IR_INQUIRY_REVIEWED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async removeInquiry(id: string, performedBy: string) {
    const inquiry = await this.findInquiry(id);
    await this.inquiryRepo.softRemove(inquiry);
    this.auditLogService.log(AuditAction.IR_INQUIRY_DELETED, performedBy, id);
    return { message: 'IR inquiry deleted successfully' };
  }

  private canViewUnpublished(user?: JwtUser | null) {
    return user?.role === UserRole.ADMIN || user?.role === UserRole.COMMUNICATION;
  }

  private async findKpi(id: string) {
    const kpi = await this.kpiRepo.findOne({ where: { id } });
    if (!kpi) {
      throw new NotFoundException('IR KPI not found');
    }
    return kpi;
  }

  private async findFinancialColumn(id: string) {
    const column = await this.columnRepo.findOne({ where: { id } });
    if (!column) {
      throw new NotFoundException('IR financial column not found');
    }
    return column;
  }

  private async findFinancialRow(id: string) {
    const row = await this.rowRepo.findOne({
      where: { id },
      relations: ['cells', 'cells.column'],
    });
    if (!row) {
      throw new NotFoundException('IR financial row not found');
    }
    return row;
  }

  private async findDocument(id: string) {
    const document = await this.documentRepo.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('IR document not found');
    }
    return document;
  }

  private async ensureColumnsExist(
    columnIds: string[],
    manager = this.dataSource.manager,
  ) {
    if (columnIds.length === 0) {
      return;
    }

    const uniqueIds = [...new Set(columnIds)];
    const count = await manager.count(IrFinancialColumn, {
      where: uniqueIds.map((id) => ({ id })),
    });

    if (count !== uniqueIds.length) {
      throw new BadRequestException('One or more financial columns were not found');
    }
  }

  private async findOrCreateSingleton<T extends { id: string }>(
    repository: Repository<T>,
    defaults: Partial<T>,
  ): Promise<T> {
    const item = await repository.findOne({
      where: { id: 'singleton' } as FindOptionsWhere<T>,
    });

    if (item) {
      return item;
    }

    const created = repository.create(defaults as any) as unknown as T;
    return (await repository.save(created as any)) as T;
  }
}
