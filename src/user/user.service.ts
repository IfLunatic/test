import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './entities/enum/userRole.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, private readonly jwtService: JwtService
    ) {}

    async create(createUserDto: CreateUserDto) {
      const existUser = await this.userRepository.findOne(
        { 
          where: { username: createUserDto.username, password: createUserDto.password } 
      });
      
      if (existUser) {
        throw new BadRequestException('User already exists');
      }
      
      const user = await this.userRepository.save(createUserDto)
      const token = this.jwtService.sign({ role: createUserDto.role });
      return {user, token}
    };

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string, password: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { 
        username: username,
        password: password
      }
    });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { 
        id: id
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, role: UserRole, userId: number) {
    if (role === UserRole.ADMIN) {
      await this.userRepository.update(id, updateUserDto);
      return this.userRepository.findOne({ where: { id } });
    } 
    else {
      if (id === userId && role === UserRole.USER) {
        if (UserRole.ADMIN === updateUserDto.role) {
          return 'You are not allowed to change the role';
        } else {
          await this.userRepository.update(id, updateUserDto);
          return this.userRepository.findOne({ where: { id } });
        }
      } else {
        return 'You are not the owner this account';
      }
    }
  }

  async remove(id: number, userId: number, role: UserRole) {
    if (id === userId) {
      await this.userRepository.delete(id);
      return 'User deleted successfully';
    } else if (role === UserRole.ADMIN) {
      await this.userRepository.delete(id);
      return 'User deleted successfully';
    } else {
      return 'You are not the owner this account';
    }
  }
}