
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./enum/userRole.enum";
import { Post } from "src/post/entities/post.entity";
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    username: string;
  
    @Column()
    password: string;
  
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;
  
    @OneToMany(() => Post, post => post.user, { onDelete: 'CASCADE' })
    posts: Post[];
  }
