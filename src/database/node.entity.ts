import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum NodeType {
  USER = 'USER',
  GROUP = 'GROUP',
}

@Entity('nodes')
export class NodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NodeType,
    nullable: false,
  })
  type: NodeType;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  email?: string;
}
