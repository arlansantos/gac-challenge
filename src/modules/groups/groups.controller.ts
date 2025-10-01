import { Controller, Post, Body } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NodeEntity } from 'src/database/node.entity';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo grupo',
    description:
      'Cria um novo nó do tipo GRUPO. Pode ser associado a um pai existente através do `parentId`.',
  })
  @ApiResponse({
    status: 201,
    description: 'O grupo foi criado com sucesso.',
    type: NodeEntity,
  })
  @ApiResponse({
    status: 400,
    description:
      'Requisição inválida (ex: pai não é um grupo, ciclo detectado).',
  })
  @ApiResponse({
    status: 404,
    description: 'O `parentId` informado não foi encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor ao criar o grupo.',
  })
  async create(@Body() createGroupDto: CreateGroupDto): Promise<NodeEntity> {
    return await this.groupsService.create(createGroupDto);
  }
}
