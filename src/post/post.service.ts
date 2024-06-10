import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/entities/enum/userRole.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.userService.findOneById(createPostDto.userId); 
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPost = this.postRepository.create({
      ...createPostDto,
      user: user,
    });
    return this.postRepository.save(newPost);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number): Promise<Post> {
    return this.postRepository.findOne({ where: { id } });
  }

  findPostWithUser(id: number): Promise<Post> {
    return this.postRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number, userRole: string): Promise<Post> {
    if (userRole === UserRole.USER) {
      const post = await this.findPostWithUser(id);
      if (post.user.id !== userId) {
        throw new NotFoundException('You are not the owner of this post');
      }
      await this.postRepository.update(id, updatePostDto);
      return this.postRepository.findOne({ where: { id } });
    }
  
    if (userRole === UserRole.ADMIN) {
      await this.postRepository.update(id, updatePostDto);
      return this.postRepository.findOne({ where: { id } });
    }
  }
  

  async remove(id: number, userId: number, userRole: string): Promise<void> {
    try {
      const post = await this.findPostWithUser(id);
  
      if (userRole === UserRole.USER && post.user.id === userId) {
        await this.postRepository.delete(id);
      } else if (userRole === UserRole.ADMIN) {
        await this.postRepository.delete(id);
      } else {
        throw new ForbiddenException('You do not have permission to delete this post');
      }
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof ForbiddenException) {
        throw err;
      }
      throw new Error('An unexpected error occurred while trying to remove the post');
    }
  }
}
