import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { ForumsService } from './forums.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post('channels')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.forumsService.createChannel(createChannelDto);
  }

  @Get('channels')
  getAllChannels() {
    return this.forumsService.getAllChannels();
  }

  @Get('channels/:id')
  getChannelById(@Param('id') id: number) {
    return this.forumsService.getChannelById(id);
  }

  @Get('channels/:id/posts')
  getPostsByChannel(@Param('id') channelId: number) {
    return this.forumsService.getPostsByChannel(channelId);
  }

  @Post('posts')
  @UseGuards(AuthGuard('jwt'))
  createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.forumsService.createPost(createPostDto, req.user.userId);
  }

  @Get('posts')
  getAllPosts() {
    return this.forumsService.getAllPosts();
  }

  @Get('posts/:id')
  getPostById(@Param('id') id: number) {
    return this.forumsService.getPostById(id);
  }

  @Patch('posts/:id/resolve')
  @UseGuards(AuthGuard('jwt'))
  markPostAsResolved(@Param('id') postId: number, @Request() req: any) {
    return this.forumsService.markPostAsResolved(postId, req.user.userId);
  }

  @Post('comments')
  @UseGuards(AuthGuard('jwt'))
  createComment(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    return this.forumsService.createComment(createCommentDto, req.user.userId);
  }

  @Patch('comments/:id/accept')
  @UseGuards(AuthGuard('jwt'))
  acceptComment(@Param('id') commentId: number, @Request() req: any) {
    return this.forumsService.acceptComment(commentId, req.user.userId);
  }

  @Post('posts/:id/ai-help')
  @UseGuards(AuthGuard('jwt'))
  getAiHelp(@Param('id') postId: number, @Request() req: any) {
    return this.forumsService.getAiHelp(postId, req.user.userId);
  }
}
