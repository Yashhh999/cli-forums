import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { ForumsService } from './forums.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('forums')
@ApiTags('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post('channels')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new channel (Admin only)' })
  @ApiResponse({ status: 201, description: 'Channel created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  createChannel(@Body() createChannelDto: CreateChannelDto) {
    return this.forumsService.createChannel(createChannelDto);
  }

  @Get('channels')
  @ApiOperation({ summary: 'Get all channels' })
  @ApiResponse({ status: 200, description: 'Channels retrieved successfully' })
  getAllChannels() {
    return this.forumsService.getAllChannels();
  }

  @Get('channels/:id')
  @ApiOperation({ summary: 'Get a channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  getChannelById(@Param('id') id: number) {
    return this.forumsService.getChannelById(id);
  }

  @Put('channels/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a channel (Admin only)' })
  @ApiResponse({ status: 200, description: 'Channel updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  updateChannel(@Param('id') id: number, @Body() updateChannelDto: CreateChannelDto) {
    return this.forumsService.updateChannel(id, updateChannelDto);
  }

  @Delete('channels/:id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a channel (Admin only)' })
  @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  deleteChannel(@Param('id') id: number) {
    return this.forumsService.deleteChannel(id);
  }

  @Get('channels/:id/posts')
  @ApiOperation({ summary: 'Get all posts in a channel' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  getPostsByChannel(@Param('id') channelId: number) {
    return this.forumsService.getPostsByChannel(channelId);
  }

  @Post('posts')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.forumsService.createPost(createPostDto, req.user.userId);
  }

  @Get('posts')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  getAllPosts() {
    return this.forumsService.getAllPosts();
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get a post by ID with comments' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  getPostById(@Param('id') id: number) {
    return this.forumsService.getPostById(id);
  }

  @Put('posts/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a post (Author only)' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Author access required' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  updatePost(@Param('id') id: number, @Body() updatePostDto: CreatePostDto, @Request() req: any) {
    return this.forumsService.updatePost(id, updatePostDto, req.user.userId);
  }

  @Delete('posts/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a post (Author only)' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Author access required' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  deletePost(@Param('id') id: number, @Request() req: any) {
    return this.forumsService.deletePost(id, req.user.userId);
  }

  @Patch('posts/:id/resolve')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mark a post as resolved (Author only)' })
  @ApiResponse({ status: 200, description: 'Post marked as resolved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Author access required' })
  markPostAsResolved(@Param('id') postId: number, @Request() req: any) {
    return this.forumsService.markPostAsResolved(postId, req.user.userId);
  }

  @Post('comments')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createComment(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    return this.forumsService.createComment(createCommentDto, req.user.userId);
  }

  @Delete('comments/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a comment (Author only)' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Author access required' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  deleteComment(@Param('id') commentId: number, @Request() req: any) {
    return this.forumsService.deleteComment(commentId, req.user.userId);
  }

  @Patch('comments/:id/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Accept a comment as the solution (Post author only)' })
  @ApiResponse({ status: 200, description: 'Comment accepted as solution' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Post author access required' })
  acceptComment(@Param('id') commentId: number, @Request() req: any) {
    return this.forumsService.acceptComment(commentId, req.user.userId);
  }

  @Post('posts/:id/ai-help')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get AI help for a post' })
  @ApiResponse({ status: 201, description: 'AI help comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  getAiHelp(@Param('id') postId: number, @Request() req: any) {
    return this.forumsService.getAiHelp(postId, req.user.userId);
  }
}
