import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ClosureEntity } from 'src/database/closure.entity';
import { NodeEntity, NodeType } from 'src/database/node.entity';
import { EntityManager, Repository } from 'typeorm';
import { NodeRelationDto } from './dto/node-relation.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NodesService {
  constructor(
    @InjectRepository(ClosureEntity)
    private readonly closureRepository: Repository<ClosureEntity>,
  ) {}

  async associateNodeToParent(
    manager: EntityManager,
    childId: string,
    parentId: string,
  ): Promise<void> {
    const parentNode = await manager.findOneBy(NodeEntity, { id: parentId });

    if (!parentNode) {
      throw new NotFoundException(`Nó pai com ID ${parentId} não encontrado.`);
    }

    if (parentNode.type !== NodeType.GROUP) {
      throw new BadRequestException(
        'Um nó só pode ser associado a um PAI do tipo GRUPO.',
      );
    }

    const cycleCheck = await manager.findOneBy(ClosureEntity, {
      ancestorId: childId,
      descendantId: parentId,
    });

    if (cycleCheck) {
      throw new ConflictException(
        'A operação foi cancelada para evitar um ciclo na hierarquia.',
      );
    }

    await manager.query(
      `
      INSERT INTO closure (ancestor_id, descendant_id, depth)
      SELECT
          p.ancestor_id,
          c.descendant_id,
          p.depth + c.depth + 1
      FROM
          closure p,
          closure c
      WHERE
          p.descendant_id = $1
      AND
          c.ancestor_id = $2
      ON CONFLICT (ancestor_id, descendant_id) DO NOTHING;
      `,
      [parentId, childId],
    );
  }

  async findAncestors(nodeId: string): Promise<NodeRelationDto[]> {
    return await this.closureRepository
      .createQueryBuilder('closure')
      .innerJoinAndSelect('closure.ancestor', 'node')
      .where('closure.descendant_id = :nodeId', { nodeId })
      .andWhere('closure.depth > 0')
      .orderBy('closure.depth', 'ASC')
      .select([
        'node.id as id',
        'node.type as type',
        'node.name as name',
        'closure.depth as depth',
      ])
      .getRawMany();
  }

  async findDescendants(nodeId: string): Promise<NodeRelationDto[]> {
    return await this.closureRepository
      .createQueryBuilder('closure')
      .innerJoinAndSelect('closure.descendant', 'node')
      .where('closure.ancestor_id = :nodeId', { nodeId })
      .andWhere('closure.depth > 0')
      .orderBy('closure.depth', 'ASC')
      .select([
        'node.id as id',
        'node.type as type',
        'node.name as name',
        'closure.depth as depth',
      ])
      .getRawMany();
  }
}
