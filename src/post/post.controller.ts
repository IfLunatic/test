import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserRole } from 'src/user/entities/enum/userRole.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    const userId = req.user.id;
    createPostDto.userId = userId; 
    return this.postService.create(createPostDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req){
    return this.postService.update(+id, updatePostDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  remove(@Param('id') id: string, @Request() req){
    return this.postService.remove(+id, req.user.id, req.user.role);
  }
}
