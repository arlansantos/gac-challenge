import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NodeEntity } from './node.entity';

@Entity('closure')
export class ClosureEntity {
  @PrimaryColumn('uuid')
  ancestor_id: string;

  @PrimaryColumn('uuid')
  descendant_id: string;

  @ManyToOne(() => NodeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ancestor_id' })
  ancestor: NodeEntity;

  @ManyToOne(() => NodeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'descendant_id' })
  descendant: NodeEntity;

  @Column({
    type: 'int',
    nullable: false,
  })
  depth: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: false })
  createdAt: Date;
}
