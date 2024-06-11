import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../entities/enum/userRole.enum";

export class CreateUserDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty({ example: 'user or admin'})
    role: UserRole;
}
