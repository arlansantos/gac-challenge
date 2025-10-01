import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NodeType {
  USER = 'USER',
  GROUP = 'GROUP',
}

@Entity('nodes')
export class NodeEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: NodeType })
  @Column({
    type: 'enum',
    enum: NodeType,
    nullable: false,
  })
  type: NodeType;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @ApiPropertyOptional()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  email?: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: false })
  createdAt: Date;

  @ApiPropertyOptional()
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
