import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NodeRelationDto } from './dto/node-relation.dto';

@ApiTags('Nodes')
@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get(':id/ancestors')
  @ApiOperation({
    summary: 'Lista os ancestrais de um nó',
    description:
      'Retorna uma lista de todos os nós pais (ancestrais) de um determinado nó, ordenados pela distância (depth), excluindo o próprio nó.',
  })
  @ApiParam({
    name: 'id',
    description:
      'O ID do nó (usuário ou grupo) para o qual se deseja encontrar os ancestrais.',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Uma lista de nós ancestrais.',
    type: [NodeRelationDto],
  })
  @ApiResponse({
    status: 404,
    description: 'O nó com o ID fornecido não foi encontrado.',
  })
  async findAncestors(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NodeRelationDto[]> {
    return await this.nodesService.findAncestors(id);
  }

  @Get(':id/descendants')
  @ApiOperation({
    summary: 'Lista os descendentes de um nó',
    description:
      'Retorna uma lista de todos os nós filhos (descendentes) de um determinado nó, ordenados pela distância (depth), excluindo o próprio nó.',
  })
  @ApiParam({
    name: 'id',
    description:
      'O ID do nó (usuário ou grupo) para o qual se deseja encontrar os descendentes.',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Uma lista de nós descendentes.',
    type: [NodeRelationDto],
  })
  @ApiResponse({
    status: 404,
    description: 'O nó com o ID fornecido não foi encontrado.',
  })
  async findDescendants(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NodeRelationDto[]> {
    return await this.nodesService.findDescendants(id);
  }
}
