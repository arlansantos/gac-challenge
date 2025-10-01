import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssociateGroupDto } from './dto/associate-group.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NodeEntity } from 'src/database/node.entity';
import { NodeRelationDto } from '../nodes/dto/node-relation.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'O usuário foi criado com sucesso.',
    type: NodeEntity,
  })
  @ApiResponse({
    status: 409,
    description: 'O e-mail informado já está em uso (Conflict).',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<NodeEntity> {
    return await this.usersService.create(createUserDto);
  }

  @Post(':id/groups')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Associa um usuário a um grupo' })
  @ApiParam({ name: 'id', description: 'O ID do usuário.' })
  @ApiResponse({
    status: 204,
    description: 'O usuário foi associado ao grupo com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'O usuário ou o grupo informado não foi encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'A associação criaria um ciclo na hierarquia (Conflict).',
  })
  async associateToGroups(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() associateGroupDto: AssociateGroupDto,
  ) {
    return await this.usersService.associateToGroups(id, associateGroupDto);
  }

  @Get(':id/organizations')
  @ApiOperation({
    summary: 'Lista as organizações de um usuário',
    description:
      'Retorna uma lista de todos os grupos (diretos e herdados) aos quais um usuário pertence, ordenados por profundidade.',
  })
  @ApiParam({ name: 'id', description: 'O ID do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'A lista de organizações do usuário.',
    type: [NodeRelationDto],
  })
  @ApiResponse({
    status: 404,
    description: 'O usuário com o ID fornecido não foi encontrado.',
  })
  async findOrganizations(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NodeRelationDto[]> {
    return await this.usersService.findOrganizations(id);
  }
}
