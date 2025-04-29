import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredRoles } from 'src/auth/required-roles.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { RoleGuard } from 'src/auth/role/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @RequiredRoles(Roles.WRITER, Roles.EDITOR)
    create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        return this.postsService.create({
            ...createPostDto,
            authorId: req.user!.id,
        });
    }

    @Get()
    @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.EDITOR)
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')
    @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.EDITOR)
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @RequiredRoles(Roles.WRITER, Roles.EDITOR)
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    @RequiredRoles(Roles.ADMIN)
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}
