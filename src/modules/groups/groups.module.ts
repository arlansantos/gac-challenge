import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from 'src/database/node.entity';
import { ClosureEntity } from 'src/database/closure.entity';
import { NodesModule } from '../nodes/nodes.module';

@Module({
  imports: [TypeOrmModule.forFeature([NodeEntity, ClosureEntity]), NodesModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
