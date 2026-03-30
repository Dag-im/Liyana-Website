import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UploadsService } from '../../uploads/uploads.service';
import { UserRole } from '../../common/types/user-role.enum';
import { CreateEsgGovernanceItemDto } from './dto/create-esg-governance-item.dto';
import { CreateEsgMetricDto } from './dto/create-esg-metric.dto';
import { CreateEsgPillarDto } from './dto/create-esg-pillar.dto';
import { CreateEsgReportDto } from './dto/create-esg-report.dto';
import { UpdateEsgGovernanceItemDto } from './dto/update-esg-governance-item.dto';
import { UpdateEsgHeroDto } from './dto/update-esg-hero.dto';
import { UpdateEsgLucsBridgeDto } from './dto/update-esg-lucs-bridge.dto';
import { UpdateEsgMetricDto } from './dto/update-esg-metric.dto';
import { UpdateEsgPillarDto } from './dto/update-esg-pillar.dto';
import { UpdateEsgReportDto } from './dto/update-esg-report.dto';
import { UpdateEsgStrategyDto } from './dto/update-esg-strategy.dto';
import { EsgGovernanceItem } from './entities/esg-governance-item.entity';
import { EsgHero } from './entities/esg-hero.entity';
import { EsgLucsBridge } from './entities/esg-lucs-bridge.entity';
import { EsgMetric } from './entities/esg-metric.entity';
import { EsgPillarInitiative } from './entities/esg-pillar-initiative.entity';
import { EsgPillar } from './entities/esg-pillar.entity';
import { EsgReport } from './entities/esg-report.entity';
import { EsgStrategy } from './entities/esg-strategy.entity';

type JwtUser = {
  sub: string;
  role: UserRole;
};

@Injectable()
export class EsgService {
  constructor(
    @InjectRepository(EsgHero)
    private readonly heroRepo: Repository<EsgHero>,
    @InjectRepository(EsgStrategy)
    private readonly strategyRepo: Repository<EsgStrategy>,
    @InjectRepository(EsgLucsBridge)
    private readonly lucsBridgeRepo: Repository<EsgLucsBridge>,
    @InjectRepository(EsgPillar)
    private readonly pillarRepo: Repository<EsgPillar>,
    @InjectRepository(EsgMetric)
    private readonly metricRepo: Repository<EsgMetric>,
    @InjectRepository(EsgGovernanceItem)
    private readonly governanceRepo: Repository<EsgGovernanceItem>,
    @InjectRepository(EsgReport)
    private readonly reportRepo: Repository<EsgReport>,
    private readonly dataSource: DataSource,
    private readonly auditLogService: AuditLogService,
    private readonly uploadsService: UploadsService,
  ) {}

  async findHero(): Promise<EsgHero | null> {
    const hero = await this.findHeroAdmin();
    return hero.isPublished ? hero : null;
  }

  async findHeroAdmin(): Promise<EsgHero> {
    return this.findOrCreateSingleton(this.heroRepo, {
      id: 'singleton',
      tagline: 'Building a Sustainable Future',
      subtitle:
        'Our commitment to Environmental, Social, and Governance excellence',
      backgroundImage: null,
      isPublished: false,
    });
  }

  async updateHero(dto: UpdateEsgHeroDto, performedBy: string): Promise<EsgHero> {
    return this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'esg-hero',
      async () => {
        const hero = await this.findHeroAdmin();
        const previousBackgroundImage =
          dto.backgroundImage &&
          hero.backgroundImage &&
          dto.backgroundImage !== hero.backgroundImage
            ? hero.backgroundImage
            : null;

        this.heroRepo.merge(hero, dto);
        const saved = await this.heroRepo.save(hero);

        if (previousBackgroundImage) {
          await this.uploadsService.delete(previousBackgroundImage);
        }

        this.auditLogService.log(
          AuditAction.ESG_HERO_UPDATED,
          performedBy,
          saved.id,
        );

        return saved;
      },
    );
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

  async findStrategy(): Promise<EsgStrategy | null> {
    const strategy = await this.findStrategyAdmin();
    return strategy.isPublished ? strategy : null;
  }

  async findStrategyAdmin(): Promise<EsgStrategy> {
    return this.findOrCreateSingleton(this.strategyRepo, {
      id: 'singleton',
      content: '',
      isPublished: false,
    });
  }

  async updateStrategy(
    dto: UpdateEsgStrategyDto,
    performedBy: string,
  ): Promise<EsgStrategy> {
    const strategy = await this.findStrategyAdmin();
    this.strategyRepo.merge(strategy, dto);
    const saved = await this.strategyRepo.save(strategy);

    this.auditLogService.log(
      AuditAction.ESG_STRATEGY_UPDATED,
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

  async findLucsBridge(): Promise<EsgLucsBridge | null> {
    const bridge = await this.findLucsBridgeAdmin();
    return bridge.isPublished ? bridge : null;
  }

  async findLucsBridgeAdmin(): Promise<EsgLucsBridge> {
    return this.findOrCreateSingleton(this.lucsBridgeRepo, {
      id: 'singleton',
      title: 'See Our Impact Through LUCS',
      description: '',
      buttonText: 'Learn About LUCS',
      isPublished: false,
    });
  }

  async updateLucsBridge(
    dto: UpdateEsgLucsBridgeDto,
    performedBy: string,
  ): Promise<EsgLucsBridge> {
    const bridge = await this.findLucsBridgeAdmin();
    this.lucsBridgeRepo.merge(bridge, dto);
    const saved = await this.lucsBridgeRepo.save(bridge);

    this.auditLogService.log(
      AuditAction.ESG_LUCS_BRIDGE_UPDATED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async publishLucsBridge() {
    const bridge = await this.findLucsBridgeAdmin();
    bridge.isPublished = true;
    return this.lucsBridgeRepo.save(bridge);
  }

  async unpublishLucsBridge() {
    const bridge = await this.findLucsBridgeAdmin();
    bridge.isPublished = false;
    return this.lucsBridgeRepo.save(bridge);
  }

  async findAllPillars(user?: JwtUser | null): Promise<EsgPillar[]> {
    const includeUnpublished = this.canViewUnpublished(user);
    return this.pillarRepo.find({
      where: includeUnpublished ? {} : { isPublished: true },
      relations: ['initiatives'],
      order: { sortOrder: 'ASC', initiatives: { sortOrder: 'ASC' } },
    });
  }

  async createPillar(dto: CreateEsgPillarDto, performedBy: string) {
    const saved = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'esg-pillar',
      async () =>
        this.dataSource.transaction(async (manager) => {
          const pillar = manager.create(EsgPillar, {
            title: dto.title,
            description: dto.description,
            icon: dto.icon,
            sortOrder: dto.sortOrder ?? 0,
            document: dto.document ?? null,
          });
          const savedPillar = await manager.save(EsgPillar, pillar);

          const initiatives = dto.initiatives.map((text, index) =>
            manager.create(EsgPillarInitiative, {
              text,
              sortOrder: index,
              pillarId: savedPillar.id,
            }),
          );
          await manager.save(EsgPillarInitiative, initiatives);

          return manager.findOneOrFail(EsgPillar, {
            where: { id: savedPillar.id },
            relations: ['initiatives'],
          });
        }),
    );

    this.auditLogService.log(
      AuditAction.ESG_PILLAR_CREATED,
      performedBy,
      saved.id,
    );

    return saved;
  }

  async updatePillar(id: string, dto: UpdateEsgPillarDto, performedBy: string) {
    const current = await this.findPillar(id);

    const updated = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'esg-pillar',
      async () =>
        this.dataSource.transaction(async (manager) => {
          const pillar = await manager.findOne(EsgPillar, {
            where: { id },
            relations: ['initiatives'],
          });

          if (!pillar) {
            throw new NotFoundException('ESG pillar not found');
          }

          const previousDocument =
            dto.document && pillar.document && dto.document !== pillar.document
              ? pillar.document
              : null;

          manager.merge(EsgPillar, pillar, {
            title: dto.title ?? pillar.title,
            description: dto.description ?? pillar.description,
            icon: dto.icon ?? pillar.icon,
            sortOrder: dto.sortOrder ?? pillar.sortOrder,
            ...(dto.document !== undefined
              ? { document: dto.document ?? null }
              : {}),
          });

          const savedPillar = await manager.save(EsgPillar, pillar);

          if (dto.initiatives !== undefined) {
            await manager.delete(EsgPillarInitiative, { pillarId: id });

            if (dto.initiatives.length > 0) {
              const initiatives = dto.initiatives.map((text, index) =>
                manager.create(EsgPillarInitiative, {
                  text,
                  sortOrder: index,
                  pillarId: savedPillar.id,
                }),
              );
              await manager.save(EsgPillarInitiative, initiatives);
            }
          }

          if (previousDocument) {
            await this.uploadsService.delete(previousDocument);
          }

          return manager.findOneOrFail(EsgPillar, {
            where: { id },
            relations: ['initiatives'],
          });
        }),
    );

    if (dto.document === null && current.document) {
      await this.uploadsService.delete(current.document);
    }

    this.auditLogService.log(
      AuditAction.ESG_PILLAR_UPDATED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async publishPillar(id: string) {
    const pillar = await this.findPillar(id);
    pillar.isPublished = true;
    return this.pillarRepo.save(pillar);
  }

  async unpublishPillar(id: string) {
    const pillar = await this.findPillar(id);
    pillar.isPublished = false;
    return this.pillarRepo.save(pillar);
  }

  async removePillar(id: string, performedBy: string) {
    const pillar = await this.findPillar(id);
    if (pillar.document) {
      await this.uploadsService.delete(pillar.document);
    }
    await this.pillarRepo.remove(pillar);
    this.auditLogService.log(AuditAction.ESG_PILLAR_DELETED, performedBy, id);
    return { message: 'ESG pillar deleted successfully' };
  }

  async findAllMetrics(user?: JwtUser | null): Promise<EsgMetric[]> {
    return this.metricRepo.find({
      where: this.canViewUnpublished(user) ? {} : { isPublished: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createMetric(dto: CreateEsgMetricDto, performedBy: string) {
    const metric = this.metricRepo.create({
      ...dto,
      suffix: dto.suffix ?? null,
      description: dto.description ?? null,
      sortOrder: dto.sortOrder ?? 0,
    });
    const saved = await this.metricRepo.save(metric);
    this.auditLogService.log(AuditAction.ESG_METRIC_CREATED, performedBy, saved.id);
    return saved;
  }

  async updateMetric(id: string, dto: UpdateEsgMetricDto, performedBy: string) {
    const metric = await this.findMetric(id);
    this.metricRepo.merge(metric, {
      ...dto,
      ...(dto.suffix !== undefined ? { suffix: dto.suffix ?? null } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description ?? null }
        : {}),
    });
    const saved = await this.metricRepo.save(metric);
    this.auditLogService.log(AuditAction.ESG_METRIC_UPDATED, performedBy, saved.id);
    return saved;
  }

  async publishMetric(id: string) {
    const metric = await this.findMetric(id);
    metric.isPublished = true;
    return this.metricRepo.save(metric);
  }

  async unpublishMetric(id: string) {
    const metric = await this.findMetric(id);
    metric.isPublished = false;
    return this.metricRepo.save(metric);
  }

  async removeMetric(id: string, performedBy: string) {
    const metric = await this.findMetric(id);
    await this.metricRepo.remove(metric);
    this.auditLogService.log(AuditAction.ESG_METRIC_DELETED, performedBy, id);
    return { message: 'ESG metric deleted successfully' };
  }

  async findAllGovernance(user?: JwtUser | null): Promise<EsgGovernanceItem[]> {
    return this.governanceRepo.find({
      where: this.canViewUnpublished(user) ? {} : { isPublished: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createGovernanceItem(
    dto: CreateEsgGovernanceItemDto,
    performedBy: string,
  ) {
    const saved = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'esg-governance',
      async () => {
        const item = this.governanceRepo.create({
          ...dto,
          document: dto.document ?? null,
          sortOrder: dto.sortOrder ?? 0,
        });
        return this.governanceRepo.save(item);
      },
    );

    this.auditLogService.log(
      AuditAction.ESG_GOVERNANCE_CREATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async updateGovernanceItem(
    id: string,
    dto: UpdateEsgGovernanceItemDto,
    performedBy: string,
  ) {
    const item = await this.findGovernanceItem(id);
    const saved = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'esg-governance',
      async () => {
        const previousDocument =
          dto.document && item.document && dto.document !== item.document
            ? item.document
            : null;
        this.governanceRepo.merge(item, {
          ...dto,
          ...(dto.document !== undefined ? { document: dto.document ?? null } : {}),
        });
        const updated = await this.governanceRepo.save(item);
        if (previousDocument) {
          await this.uploadsService.delete(previousDocument);
        }
        return updated;
      },
    );

    this.auditLogService.log(
      AuditAction.ESG_GOVERNANCE_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async publishGovernanceItem(id: string) {
    const item = await this.findGovernanceItem(id);
    item.isPublished = true;
    return this.governanceRepo.save(item);
  }

  async unpublishGovernanceItem(id: string) {
    const item = await this.findGovernanceItem(id);
    item.isPublished = false;
    return this.governanceRepo.save(item);
  }

  async removeGovernanceItem(id: string, performedBy: string) {
    const item = await this.findGovernanceItem(id);
    if (item.document) {
      await this.uploadsService.delete(item.document);
    }
    await this.governanceRepo.remove(item);
    this.auditLogService.log(
      AuditAction.ESG_GOVERNANCE_DELETED,
      performedBy,
      id,
    );
    return { message: 'ESG governance item deleted successfully' };
  }

  async findAllReports(user?: JwtUser | null): Promise<EsgReport[]> {
    return this.reportRepo.find({
      where: this.canViewUnpublished(user) ? {} : { isPublished: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createReport(dto: CreateEsgReportDto, performedBy: string) {
    const saved = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'esg-report',
      async () => {
        const report = this.reportRepo.create({
          ...dto,
          sortOrder: dto.sortOrder ?? 0,
        });
        return this.reportRepo.save(report);
      },
    );

    this.auditLogService.log(AuditAction.ESG_REPORT_CREATED, performedBy, saved.id);
    return saved;
  }

  async updateReport(id: string, dto: UpdateEsgReportDto, performedBy: string) {
    const report = await this.findReport(id);
    const saved = await this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'esg-report',
      async () => {
        const previousFile =
          dto.filePath && report.filePath && dto.filePath !== report.filePath
            ? report.filePath
            : null;
        this.reportRepo.merge(report, dto);
        const updated = await this.reportRepo.save(report);
        if (previousFile) {
          await this.uploadsService.delete(previousFile);
        }
        return updated;
      },
    );

    this.auditLogService.log(AuditAction.ESG_REPORT_UPDATED, performedBy, saved.id);
    return saved;
  }

  async publishReport(id: string) {
    const report = await this.findReport(id);
    report.isPublished = true;
    return this.reportRepo.save(report);
  }

  async unpublishReport(id: string) {
    const report = await this.findReport(id);
    report.isPublished = false;
    return this.reportRepo.save(report);
  }

  async removeReport(id: string, performedBy: string) {
    const report = await this.findReport(id);
    await this.uploadsService.delete(report.filePath);
    await this.reportRepo.remove(report);
    this.auditLogService.log(AuditAction.ESG_REPORT_DELETED, performedBy, id);
    return { message: 'ESG report deleted successfully' };
  }

  private canViewUnpublished(user?: JwtUser | null) {
    return user?.role === UserRole.ADMIN || user?.role === UserRole.COMMUNICATION;
  }

  private async findPillar(id: string) {
    const pillar = await this.pillarRepo.findOne({
      where: { id },
      relations: ['initiatives'],
    });
    if (!pillar) {
      throw new NotFoundException('ESG pillar not found');
    }
    return pillar;
  }

  private async findMetric(id: string) {
    const metric = await this.metricRepo.findOne({ where: { id } });
    if (!metric) {
      throw new NotFoundException('ESG metric not found');
    }
    return metric;
  }

  private async findGovernanceItem(id: string) {
    const item = await this.governanceRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('ESG governance item not found');
    }
    return item;
  }

  private async findReport(id: string) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('ESG report not found');
    }
    return report;
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
