import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from 'src/database/node.entity';
import { ClosureEntity } from 'src/database/closure.entity';
import { NodesModule } from '../nodes/nodes.module';
@Module({
  imports: [TypeOrmModule.forFeature([NodeEntity, ClosureEntity]), NodesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
