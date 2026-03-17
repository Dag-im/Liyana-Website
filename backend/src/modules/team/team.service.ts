import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UploadsService } from '../../uploads/uploads.service';
import { DivisionsService } from '../services/divisions/divisions.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { QueryTeamMemberDto } from './dto/query-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember } from './entity/team-member.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    private readonly divisionsService: DivisionsService,
    private readonly uploadsService: UploadsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateTeamMemberDto, performedBy: string): Promise<TeamMember> {
    if (dto.isCorporate && dto.divisionId) {
      throw new BadRequestException('Corporate members cannot be assigned to a division');
    }
    if (!dto.isCorporate && !dto.divisionId) {
      throw new BadRequestException('Non-corporate members must be assigned to a division');
    }

    if (dto.divisionId) {
      await this.divisionsService.findOne(dto.divisionId);
    }

    const member = this.teamMemberRepository.create(dto);
    const savedMember = await this.teamMemberRepository.save(member);

    this.auditLogService.log(AuditAction.TEAM_MEMBER_CREATED, performedBy, savedMember.id);

    return this.findOne(savedMember.id, true);
  }

  async findAll(queryDto: QueryTeamMemberDto) {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.teamMemberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.division', 'division');

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('member.name LIKE :search', { search }).orWhere(
            'member.position LIKE :search',
            { search },
          );
        }),
      );
    }

    if (queryDto.divisionId) {
      query.andWhere('member.divisionId = :divisionId', {
        divisionId: queryDto.divisionId,
      });
    }

    if (queryDto.isCorporate !== undefined) {
      query.andWhere('member.isCorporate = :isCorporate', {
        isCorporate: queryDto.isCorporate,
      });
    }

    if (!queryDto.includeHidden) {
      query.andWhere(
        '(member.isCorporate = true OR (division.deletedAt IS NULL AND division.isActive = true))',
      );
    }

    query
      .orderBy('member.sortOrder', 'ASC')
      .addOrderBy('member.createdAt', 'ASC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      perPage,
    };
  }

  async findOne(id: string, includeHidden = false): Promise<TeamMember> {
    const member = await this.teamMemberRepository.findOne({
      where: { id },
      relations: ['division'],
    });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    if (!includeHidden) {
      const isVisible =
        member.isCorporate ||
        (member.division && !member.division.deletedAt && member.division.isActive);

      if (!isVisible) {
        throw new NotFoundException('Team member not found');
      }
    }

    return member;
  }

  async update(
    id: string,
    dto: UpdateTeamMemberDto,
    performedBy: string,
  ): Promise<TeamMember> {
    const member = await this.findOne(id, true);

    const effectiveIsCorporate = dto.isCorporate ?? member.isCorporate;
    const effectiveDivisionId = 'divisionId' in dto ? dto.divisionId : member.divisionId;

    if (effectiveIsCorporate && effectiveDivisionId) {
      throw new BadRequestException('Corporate members cannot be assigned to a division');
    }
    if (!effectiveIsCorporate && !effectiveDivisionId) {
      throw new BadRequestException('Non-corporate members must be assigned to a division');
    }

    if (dto.divisionId) {
      await this.divisionsService.findOne(dto.divisionId);
    }

    if (dto.image && member.image && dto.image !== member.image) {
      await this.uploadsService.delete(member.image);
    }

    Object.assign(member, dto);
    const updatedMember = await this.teamMemberRepository.save(member);

    this.auditLogService.log(AuditAction.TEAM_MEMBER_UPDATED, performedBy, id);

    return this.findOne(updatedMember.id, true);
  }

  async remove(id: string, performedBy: string): Promise<void> {
    const member = await this.findOne(id, true);

    if (member.image) {
      await this.uploadsService.delete(member.image);
    }

    await this.teamMemberRepository.softDelete(id);

    this.auditLogService.log(AuditAction.TEAM_MEMBER_DELETED, performedBy, id);
  }
}
