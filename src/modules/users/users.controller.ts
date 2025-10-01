import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssociateGroupDto } from './dto/associate-group.dto';

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
    @Body() associateGroupDto: AssociateGroupDto,
  ) {
    return await this.usersService.associateToGroups(id, associateGroupDto);
  }

  @Get(':id/organizations')
  async findOrganizations(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOrganizations(id);
  }
}
