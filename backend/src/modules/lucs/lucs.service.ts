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
import { CreateLucsInquiryDto } from './dto/create-lucs-inquiry.dto';
import { CreateLucsPillarDto } from './dto/create-lucs-pillar.dto';
import { QueryLucsInquiryDto } from './dto/query-lucs-inquiry.dto';
import { UpdateLucsCtaDto } from './dto/update-lucs-cta.dto';
import { UpdateLucsHeroDto } from './dto/update-lucs-hero.dto';
import { UpdateLucsMissionDto } from './dto/update-lucs-mission.dto';
import { UpdateLucsPillarDto } from './dto/update-lucs-pillar.dto';
import { UpdateLucsPillarIntroDto } from './dto/update-lucs-pillar-intro.dto';
import { UpdateLucsWhoWeAreDto } from './dto/update-lucs-who-we-are.dto';
import { LucsBulletPoint } from './entities/lucs-bullet-point.entity';
import { LucsCta } from './entities/lucs-cta.entity';
import { LucsHero } from './entities/lucs-hero.entity';
import { LucsInquiry } from './entities/lucs-inquiry.entity';
import { LucsMission } from './entities/lucs-mission.entity';
import { LucsPillarIntro } from './entities/lucs-pillar-intro.entity';
import { LucsPillar } from './entities/lucs-pillar.entity';
import { LucsWhoWeAre } from './entities/lucs-who-we-are.entity';

type JwtUser = {
  sub: string;
  role: UserRole;
};

@Injectable()
export class LucsService {
  constructor(
    @InjectRepository(LucsHero)
    private readonly heroRepo: Repository<LucsHero>,
    @InjectRepository(LucsWhoWeAre)
    private readonly whoWeAreRepo: Repository<LucsWhoWeAre>,
    @InjectRepository(LucsMission)
    private readonly missionRepo: Repository<LucsMission>,
    @InjectRepository(LucsPillarIntro)
    private readonly pillarIntroRepo: Repository<LucsPillarIntro>,
    @InjectRepository(LucsPillar)
    private readonly pillarRepo: Repository<LucsPillar>,
    @InjectRepository(LucsBulletPoint)
    private readonly bulletPointRepo: Repository<LucsBulletPoint>,
    @InjectRepository(LucsCta)
    private readonly ctaRepo: Repository<LucsCta>,
    @InjectRepository(LucsInquiry)
    private readonly inquiryRepo: Repository<LucsInquiry>,
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
      tagline: 'Transforming Communities Through Healthcare',
      subtitle: '',
      backgroundImage: null,
      isPublished: false,
    });
  }

  async updateHero(dto: UpdateLucsHeroDto, performedBy: string) {
    return this.uploadsService.withEntityUploads(
      performedBy,
      dto,
      'lucs-hero',
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
          AuditAction.LUCS_HERO_UPDATED,
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

  async findWhoWeAre() {
    const item = await this.findWhoWeAreAdmin();
    return item.isPublished ? item : null;
  }

  async findWhoWeAreAdmin() {
    return this.findOrCreateSingleton(this.whoWeAreRepo, {
      id: 'singleton',
      content: '',
      isPublished: false,
    });
  }

  async updateWhoWeAre(dto: UpdateLucsWhoWeAreDto, performedBy: string) {
    const item = await this.findWhoWeAreAdmin();
    this.whoWeAreRepo.merge(item, dto);
    const saved = await this.whoWeAreRepo.save(item);
    this.auditLogService.log(
      AuditAction.LUCS_WHO_WE_ARE_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async publishWhoWeAre() {
    const item = await this.findWhoWeAreAdmin();
    item.isPublished = true;
    return this.whoWeAreRepo.save(item);
  }

  async unpublishWhoWeAre() {
    const item = await this.findWhoWeAreAdmin();
    item.isPublished = false;
    return this.whoWeAreRepo.save(item);
  }

  async findMission() {
    const item = await this.findMissionAdmin();
    return item.isPublished ? item : null;
  }

  async findMissionAdmin() {
    return this.findOrCreateSingleton(this.missionRepo, {
      id: 'singleton',
      missionTitle: 'Our Mission',
      missionDescription: '',
      missionIcon: 'Target',
      visionTitle: 'Our Vision',
      visionDescription: '',
      visionIcon: 'Eye',
      isPublished: false,
    });
  }

  async updateMission(dto: UpdateLucsMissionDto, performedBy: string) {
    const item = await this.findMissionAdmin();
    this.missionRepo.merge(item, dto);
    const saved = await this.missionRepo.save(item);
    this.auditLogService.log(
      AuditAction.LUCS_MISSION_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async publishMission() {
    const item = await this.findMissionAdmin();
    item.isPublished = true;
    return this.missionRepo.save(item);
  }

  async unpublishMission() {
    const item = await this.findMissionAdmin();
    item.isPublished = false;
    return this.missionRepo.save(item);
  }

  async findPillarIntro() {
    const item = await this.findPillarIntroAdmin();
    return item.isPublished ? item : null;
  }

  async findPillarIntroAdmin() {
    return this.findOrCreateSingleton(this.pillarIntroRepo, {
      id: 'singleton',
      title: 'What We Do',
      description: '',
      isPublished: false,
    });
  }

  async updatePillarIntro(dto: UpdateLucsPillarIntroDto, performedBy: string) {
    const item = await this.findPillarIntroAdmin();
    this.pillarIntroRepo.merge(item, dto);
    const saved = await this.pillarIntroRepo.save(item);
    this.auditLogService.log(
      AuditAction.LUCS_PILLAR_INTRO_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async publishPillarIntro() {
    const item = await this.findPillarIntroAdmin();
    item.isPublished = true;
    return this.pillarIntroRepo.save(item);
  }

  async unpublishPillarIntro() {
    const item = await this.findPillarIntroAdmin();
    item.isPublished = false;
    return this.pillarIntroRepo.save(item);
  }

  async findCta() {
    const item = await this.findCtaAdmin();
    return item.isPublished ? item : null;
  }

  async findCtaAdmin() {
    return this.findOrCreateSingleton(this.ctaRepo, {
      id: 'singleton',
      title: 'Partner With Us',
      description: null,
      ctaType: 'email' as any,
      ctaValue: '',
      ctaLabel: 'Get In Touch',
      isPublished: false,
    });
  }

  async updateCta(dto: UpdateLucsCtaDto, performedBy: string) {
    const item = await this.findCtaAdmin();
    this.ctaRepo.merge(item, {
      ...dto,
      ...(dto.description !== undefined ? { description: dto.description ?? null } : {}),
    });
    const saved = await this.ctaRepo.save(item);
    this.auditLogService.log(AuditAction.LUCS_CTA_UPDATED, performedBy, saved.id);
    return saved;
  }

  async publishCta() {
    const item = await this.findCtaAdmin();
    item.isPublished = true;
    return this.ctaRepo.save(item);
  }

  async unpublishCta() {
    const item = await this.findCtaAdmin();
    item.isPublished = false;
    return this.ctaRepo.save(item);
  }

  async findAllPillars(user?: JwtUser | null) {
    return this.pillarRepo.find({
      where: this.canViewUnpublished(user) ? {} : { isPublished: true },
      relations: ['bulletPoints'],
      order: { sortOrder: 'ASC' },
    });
  }

  async createPillar(dto: CreateLucsPillarDto, performedBy: string) {
    const saved = await this.dataSource.transaction(async (manager) => {
      const pillar = manager.create(LucsPillar, {
        title: dto.title,
        description: dto.description ?? null,
        icon: dto.icon,
        sortOrder: dto.sortOrder ?? 0,
      });
      const savedPillar = await manager.save(LucsPillar, pillar);

      const bulletPoints = dto.bulletPoints.map((bulletPoint) =>
        manager.create(LucsBulletPoint, {
          pillarId: savedPillar.id,
          point: bulletPoint.point,
          description: bulletPoint.description ?? null,
        }),
      );
      await manager.save(LucsBulletPoint, bulletPoints);

      return manager.findOneOrFail(LucsPillar, {
        where: { id: savedPillar.id },
        relations: ['bulletPoints'],
      });
    });

    this.auditLogService.log(
      AuditAction.LUCS_PILLAR_CREATED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async updatePillar(id: string, dto: UpdateLucsPillarDto, performedBy: string) {
    const saved = await this.dataSource.transaction(async (manager) => {
      const pillar = await manager.findOne(LucsPillar, {
        where: { id },
        relations: ['bulletPoints'],
      });

      if (!pillar) {
        throw new NotFoundException('LUCS pillar not found');
      }

      manager.merge(LucsPillar, pillar, {
        ...dto,
        ...(dto.description !== undefined ? { description: dto.description ?? null } : {}),
      });
      const savedPillar = await manager.save(LucsPillar, pillar);

      if (dto.bulletPoints) {
        await manager.delete(LucsBulletPoint, { pillarId: id });

        if (dto.bulletPoints.length > 0) {
          const bulletPoints = dto.bulletPoints.map((bulletPoint) =>
            manager.create(LucsBulletPoint, {
              pillarId: id,
              point: bulletPoint.point,
              description: bulletPoint.description ?? null,
            }),
          );
          await manager.save(LucsBulletPoint, bulletPoints);
        }
      }

      return manager.findOneOrFail(LucsPillar, {
        where: { id: savedPillar.id },
        relations: ['bulletPoints'],
      });
    });

    this.auditLogService.log(
      AuditAction.LUCS_PILLAR_UPDATED,
      performedBy,
      saved.id,
    );
    return saved;
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
    await this.pillarRepo.remove(pillar);
    this.auditLogService.log(AuditAction.LUCS_PILLAR_DELETED, performedBy, id);
    return { message: 'LUCS pillar deleted successfully' };
  }

  async createInquiry(dto: CreateLucsInquiryDto) {
    const inquiry = this.inquiryRepo.create({
      ...dto,
      isReviewed: false,
    });
    const saved = await this.inquiryRepo.save(inquiry);

    void this.notificationsService.createForRoles(
      [UserRole.ADMIN, UserRole.LUCS_ADMIN],
      {
        title: 'New LUCS Inquiry',
        message: `${saved.name} (${saved.email}) submitted a new LUCS inquiry requiring review.`,
        urgency: NotificationUrgency.MEDIUM,
        relatedEntityType: 'lucs',
        relatedEntityId: saved.id,
      },
      'system',
    );

    this.auditLogService.log(
      AuditAction.LUCS_INQUIRY_SUBMITTED,
      'public',
      saved.id,
    );

    return saved;
  }

  async findAllInquiries(queryDto: QueryLucsInquiryDto) {
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
      throw new NotFoundException('LUCS inquiry not found');
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
      AuditAction.LUCS_INQUIRY_REVIEWED,
      performedBy,
      saved.id,
    );
    return saved;
  }

  async removeInquiry(id: string, performedBy: string) {
    const inquiry = await this.findInquiry(id);
    await this.inquiryRepo.softRemove(inquiry);
    this.auditLogService.log(AuditAction.LUCS_INQUIRY_DELETED, performedBy, id);
    return { message: 'LUCS inquiry deleted successfully' };
  }

  private canViewUnpublished(user?: JwtUser | null) {
    return user?.role === UserRole.ADMIN || user?.role === UserRole.LUCS_ADMIN;
  }

  private async findPillar(id: string) {
    const pillar = await this.pillarRepo.findOne({
      where: { id },
      relations: ['bulletPoints'],
    });
    if (!pillar) {
      throw new NotFoundException('LUCS pillar not found');
    }
    return pillar;
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
