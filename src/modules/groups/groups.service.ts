import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { NodeEntity, NodeType } from 'src/database/node.entity';
import { ClosureEntity } from 'src/database/closure.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(NodeEntity)
    private readonly nodeRepository: Repository<NodeEntity>,
    @InjectRepository(ClosureEntity)
    private readonly closureRepository: Repository<ClosureEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<NodeEntity> {
    const { name } = createGroupDto;

    const groupNode = this.nodeRepository.create({
      name,
      type: NodeType.GROUP,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(groupNode);

      // Criar a relação de auto-referência (depth 0)
      const selfReference = this.closureRepository.create({
        ancestor_id: groupNode.id,
        descendant_id: groupNode.id,
        depth: 0,
      });
      await queryRunner.manager.save(selfReference);

      await queryRunner.commitTransaction();
      return groupNode;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Erro ao criar o grupo.', err);
    } finally {
      await queryRunner.release();
    }
  }
}
