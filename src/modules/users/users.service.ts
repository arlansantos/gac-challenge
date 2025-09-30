import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { NodeEntity, NodeType } from 'src/database/node.entity';
import { ClosureEntity } from 'src/database/closure.entity';
import { AssociateGroupsDto } from './dto/associate-groups.dto';
import { NodesService } from '../nodes/nodes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(NodeEntity)
    private readonly nodeRepository: Repository<NodeEntity>,
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
        ancestor_id: userNode.id,
        descendant_id: userNode.id,
        depth: 0,
      });
      await queryRunner.manager.save(selfReference);

      await queryRunner.commitTransaction();
      return userNode;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Erro ao criar usuário.', err);
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
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Erro ao associar usuário aos grupos.',
        err,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
