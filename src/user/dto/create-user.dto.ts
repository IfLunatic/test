import { UserRole } from "../entities/enum/userRole.enum";

export class CreateUserDto {
    username: string;
    password: string;
    role: UserRole;
}
