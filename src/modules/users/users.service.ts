import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { NodeEntity, NodeType } from 'src/database/node.entity';
import { ClosureEntity } from 'src/database/closure.entity';
import { AssociateGroupsDto } from './dto/associate-groups.dto';
import { NodesService } from '../nodes/nodes.service';
import { NodeRelationDto } from '../nodes/dto/node-relation.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(NodeEntity)
    private readonly nodeRepository: Repository<NodeEntity>,
    @InjectRepository(ClosureEntity)
    private readonly closureRepository: Repository<ClosureEntity>,
    private readonly dataSource: DataSource,
    private readonly nodesService: NodesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<NodeEntity> {
    const { name, email } = createUserDto;

    const existingUser = await this.nodeRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('O e-mail informado já está em uso.');
    }

    const userNode = this.nodeRepository.create({
      name,
      email,
      type: NodeType.USER,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(userNode);

      const selfReference = queryRunner.manager.create(ClosureEntity, {
        ancestorId: userNode.id,
        descendantId: userNode.id,
        depth: 0,
      });
      await queryRunner.manager.save(selfReference);

      await queryRunner.commitTransaction();
      return userNode;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar usuário.');
    } finally {
      await queryRunner.release();
    }
  }
  async associateToGroups(
    userId: string,
    associateGroupsDto: AssociateGroupsDto,
  ): Promise<void> {
    const { groups } = associateGroupsDto;

    const user = await this.nodeRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const groupId of groups) {
        await this.nodesService.associateNodeToParent(
          queryRunner.manager,
          userId,
          groupId,
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao associar usuário aos grupos.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findOrganizations(userId: string): Promise<NodeRelationDto[]> {
    const user = await this.nodeRepository.findOneBy({
      id: userId,
      type: NodeType.USER,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
    }

    return await this.closureRepository
      .createQueryBuilder('closure')
      .innerJoin('closure.ancestor', 'node')
      .where('closure.descendant_id = :userId', { userId })
      .andWhere('closure.depth > 0')
      .andWhere('node.type = :type', { type: NodeType.GROUP })
      .orderBy('closure.depth', 'ASC')
      .select(['node.id as id', 'node.name as name', 'closure.depth as depth'])
      .getRawMany();
  }
}
