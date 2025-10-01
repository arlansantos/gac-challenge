import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClosureEntity } from 'src/database/closure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClosureEntity])],
  providers: [NodesService],
  exports: [NodesService],
})
export class NodesModule {}
