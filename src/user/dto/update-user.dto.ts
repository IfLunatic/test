import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../entities/enum/userRole.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    username?: string;
    password?: string;
    role?: UserRole;
}
