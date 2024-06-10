import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/enum/userRole.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { IsUserRoute } from 'src/decorators/allow.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsUserRoute()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req){
    return this.userService.update(+id, updateUserDto, req.user.role, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  remove(@Param('id') id: string, @Request() req){
    return this.userService.remove(+id, req.user.id, req.user.role);
  }
}
