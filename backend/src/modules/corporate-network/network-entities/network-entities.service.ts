import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuditLogService } from '../../../common/services/audit-log.service';
import { NetworkEntity } from '../entities/network-entity.entity';
import { NetworkRelationsService } from '../network-relations/network-relations.service';
import { CreateNetworkEntityDto } from './dto/create-network-entity.dto';
import { MoveNetworkEntityDto } from './dto/move-network-entity.dto';
import { QueryNetworkEntityDto } from './dto/query-network-entity.dto';
import { UpdateNetworkEntityDto } from './dto/update-network-entity.dto';

@Injectable()
export class NetworkEntitiesService {
  constructor(
    @InjectRepository(NetworkEntity)
    private readonly repo: Repository<NetworkEntity>,
    private readonly relationsService: NetworkRelationsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findAll(queryDto: QueryNetworkEntityDto) {
    const page = queryDto.page ?? 1;
    const perPage = queryDto.perPage ?? 20;

    const query = this.repo.createQueryBuilder('entity');
    query.leftJoinAndSelect('entity.relation', 'relation');
    query.andWhere('entity.deletedAt IS NULL');

    if (queryDto.parentId !== undefined) {
      if (queryDto.parentId === null) {
        query.andWhere('entity.parentId IS NULL');
      } else {
        query.andWhere('entity.parentId = :parentId', {
          parentId: queryDto.parentId,
        });
      }
    }

    if (queryDto.relationId) {
      query.andWhere('entity.relationId = :relationId', {
        relationId: queryDto.relationId,
      });
    }

    if (queryDto.search) {
      const search = `%${queryDto.search}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('entity.name LIKE :search', { search }).orWhere(
            'entity.summary LIKE :search',
            { search },
          );
        }),
      );
    }

    query.orderBy('entity.sortOrder', 'ASC').addOrderBy('entity.name', 'ASC');

    const [data, total] = await query
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      perPage,
    };
  }

  async findTree(): Promise<NetworkEntity[]> {
    const entities = await this.repo.find({
      where: { deletedAt: IsNull() },
      order: { sortOrder: 'ASC' },
      relations: ['relation'],
    });

    return this.buildTree(entities);
  }

  async findOne(id: string): Promise<NetworkEntity> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['relation', 'children'],
    });

    if (!entity) {
      throw new NotFoundException(`Network entity with ID ${id} not found`);
    }

    return entity;
  }

  async create(
    dto: CreateNetworkEntityDto,
    performedBy: string,
  ): Promise<NetworkEntity> {
    await this.relationsService.findOne(dto.relationId);

    if (dto.parentId) {
      const parent = await this.repo.findOne({
        where: { id: dto.parentId, deletedAt: IsNull() },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent entity with ID ${dto.parentId} not found`,
        );
      }
    }

    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);

    this.auditLogService.log(
      AuditAction.NETWORK_ENTITY_CREATED,
      performedBy,
      saved.id,
    );

    return this.repo.findOne({
      where: { id: saved.id },
      relations: ['relation'],
    }) as Promise<NetworkEntity>;
  }

  async update(
    id: string,
    dto: UpdateNetworkEntityDto,
    performedBy: string,
  ): Promise<NetworkEntity> {
    const entity = await this.findOne(id);
    let relationToAssign: Awaited<
      ReturnType<NetworkRelationsService['findOne']>
    > | null = null;

    if (dto.relationId) {
      relationToAssign = await this.relationsService.findOne(dto.relationId);
    }

    Object.assign(entity, dto);
    if (relationToAssign) {
      entity.relation = relationToAssign;
    }
    const updated = await this.repo.save(entity);

    this.auditLogService.log(
      AuditAction.NETWORK_ENTITY_UPDATED,
      performedBy,
      updated.id,
    );

    return updated;
  }

  async move(
    id: string,
    dto: MoveNetworkEntityDto,
    performedBy: string,
  ): Promise<NetworkEntity> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!entity) {
      throw new NotFoundException(`Network entity with ID ${id} not found`);
    }

    const previousParentId = entity.parentId;

    if (dto.parentId) {
      const parent = await this.repo.findOne({
        where: { id: dto.parentId, deletedAt: IsNull() },
      });
      if (!parent) {
        throw new NotFoundException(
          `New parent entity with ID ${dto.parentId} not found`,
        );
      }

      if (await this.wouldCreateCycle(id, dto.parentId)) {
        throw new BadRequestException(
          'Cannot move an entity under its own descendant',
        );
      }
    }

    entity.parentId = dto.parentId;
    const moved = await this.repo.save(entity);

    this.auditLogService.log(
      AuditAction.NETWORK_ENTITY_MOVED,
      performedBy,
      moved.id,
      {
        previousParentId,
        newParentId: dto.parentId,
      },
    );

    return moved;
  }

  async remove(id: string, performedBy: string): Promise<void> {
    await this.findOne(id);

    await this.softDeleteDescendants(id);
    await this.repo.softDelete(id);

    this.auditLogService.log(
      AuditAction.NETWORK_ENTITY_DELETED,
      performedBy,
      id,
    );
  }

  private buildTree(entities: NetworkEntity[]): NetworkEntity[] {
    const map = new Map<
      string,
      NetworkEntity & { children: NetworkEntity[] }
    >();
    const roots: NetworkEntity[] = [];

    entities.forEach((e) => {
      map.set(e.id, { ...e, children: [] });
    });

    map.forEach((node) => {
      if (node.parentId && map.has(node.parentId)) {
        map.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sort children by sortOrder at each level
    const sortChildren = (nodes: (NetworkEntity & { children: any[] })[]) => {
      nodes.sort((a, b) => a.sortOrder - b.sortOrder);
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          sortChildren(n.children);
        }
      });
    };
    sortChildren(roots);

    return roots;
  }

  private async wouldCreateCycle(
    entityId: string,
    newParentId: string,
  ): Promise<boolean> {
    let currentId: string | null = newParentId;
    while (currentId !== null) {
      if (currentId === entityId) return true;
      const parent = await this.repo.findOne({
        where: { id: currentId },
        select: ['id', 'parentId'],
      });
      currentId = parent?.parentId ?? null;
    }
    return false;
  }

  private async softDeleteDescendants(parentId: string): Promise<void> {
    const children = await this.repo.find({
      where: { parentId, deletedAt: IsNull() },
    });
    for (const child of children) {
      await this.softDeleteDescendants(child.id);
      await this.repo.softDelete(child.id);
    }
  }
}
