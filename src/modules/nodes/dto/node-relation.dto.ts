import { ApiProperty } from '@nestjs/swagger';
import { NodeType } from 'src/database/node.entity';

export class NodeRelationDto {
  @ApiProperty({
    description: 'O ID do nó relacionado (ancestral ou descendente).',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'O tipo do nó.',
    enum: NodeType,
    example: NodeType.GROUP,
  })
  type: string;

  @ApiProperty({
    description: 'O nome do nó.',
    example: 'Tecnologia',
  })
  name: string;

  @ApiProperty({
    description:
      'A distância (profundidade) na hierarquia a partir do nó de origem.',
    example: 2,
  })
  depth: number;
}
