import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClosureEntity } from 'src/database/closure.entity';
import { NodesController } from './nodes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClosureEntity])],
  controllers: [NodesController],
  providers: [NodesService],
  exports: [NodesService],
})
export class NodesModule {}
