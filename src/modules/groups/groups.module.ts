import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from 'src/database/node.entity';
import { ClosureEntity } from 'src/database/closure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NodeEntity, ClosureEntity])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
