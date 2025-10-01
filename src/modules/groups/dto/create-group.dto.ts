import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    description: 'O nome do grupo a ser criado.',
    example: 'Engenharia de Software',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description:
      'O ID do grupo pai (opcional). Se não for fornecido, o grupo será criado na raiz.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
