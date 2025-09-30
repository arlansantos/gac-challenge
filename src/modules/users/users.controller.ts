import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssociateGroupsDto } from './dto/associate-groups.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post(':id/groups')
  @HttpCode(HttpStatus.NO_CONTENT)
  async associateToGroups(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() associateGroupsDto: AssociateGroupsDto,
  ) {
    return await this.usersService.associateToGroups(id, associateGroupsDto);
  }
}
