import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'O nome completo do usuário.',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'O endereço de e-mail do usuário, que deve ser único.',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
