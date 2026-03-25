import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../common/enums/audit-action.enum';
import { AuditLogService } from '../../common/services/audit-log.service';
import { UploadsService } from '../../uploads/uploads.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { QueryAwardDto } from './dto/query-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { Award } from './entity/award.entity';

@Injectable()
export class AwardsService {
  constructor(
    @InjectRepository(Award)
    private readonly awardRepository: Repository<Award>,
    private readonly uploadsService: UploadsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createAwardDto: CreateAwardDto, performedBy: string) {
    return this.uploadsService.withEntityUploads(
      performedBy,
      createAwardDto,
      'award',
      async () => {
        const award = this.awardRepository.create(createAwardDto);
        const savedAward = await this.awardRepository.save(award);

        this.auditLogService.log(
          AuditAction.AWARD_CREATED,
          performedBy,
          savedAward.id,
          { title: savedAward.title },
        );

        return savedAward;
      },
    );
  }

  async findAll(queryDto: QueryAwardDto) {
    const {
      page = 1,
      perPage = 10,
      search,
      year,
      category,
      sortBy = 'sortOrder',
      sortOrder = 'ASC',
    } = queryDto;

    const query = this.awardRepository.createQueryBuilder('award');

    if (search) {
      query.andWhere(
        '(award.title LIKE :search OR award.organization LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (year) {
      query.andWhere('award.year = :year', { year });
    }

    if (category) {
      query.andWhere('award.category = :category', { category });
    }

    query
      .orderBy(`award.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .addOrderBy('award.year', 'DESC')
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

  async findOne(id: string) {
    const award = await this.awardRepository.findOne({ where: { id } });
    if (!award) {
      throw new NotFoundException(`Award with ID ${id} not found`);
    }
    return award;
  }

  async update(
    id: string,
    updateAwardDto: UpdateAwardDto,
    performedBy: string,
  ) {
    return this.uploadsService.withEntityUploads(
      performedBy,
      updateAwardDto,
      'award',
      async () => {
        const award = await this.findOne(id);
        const previousImage =
          updateAwardDto.image && updateAwardDto.image !== award.image
            ? award.image
            : null;

        Object.assign(award, updateAwardDto);
        const updatedAward = await this.awardRepository.save(award);

        if (previousImage) {
          await this.uploadsService.delete(previousImage);
        }

        this.auditLogService.log(
          AuditAction.AWARD_UPDATED,
          performedBy,
          updatedAward.id,
          { title: updatedAward.title },
        );

        return updatedAward;
      },
    );
  }

  async remove(id: string, performedBy: string) {
    const award = await this.findOne(id);

    // According to instructions: await this.uploadsService.delete(award.image). Soft delete.
    await this.uploadsService.delete(award.image);
    await this.awardRepository.softRemove(award);

    this.auditLogService.log(AuditAction.AWARD_DELETED, performedBy, id, {
      title: award.title,
    });

    return { message: 'Award deleted successfully' };
  }
}
