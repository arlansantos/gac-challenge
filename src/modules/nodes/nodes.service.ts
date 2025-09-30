import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ClosureEntity } from 'src/database/closure.entity';
import { NodeEntity, NodeType } from 'src/database/node.entity';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class NodesService {
  constructor(private readonly dataSource: DataSource) {}

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
      ancestor_id: childId,
      descendant_id: parentId,
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
}
