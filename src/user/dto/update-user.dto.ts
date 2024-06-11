import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../entities/enum/userRole.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    username?: string;

    @ApiProperty()
    password?: string;

    @ApiProperty({ example: 'user or admin'})
    role?: UserRole;
}
