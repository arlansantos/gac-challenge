import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssociateGroupDto {
  @ApiProperty({
    description: 'O ID do grupo ao qual o usuário será associado.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  groupId: string;
}
