import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { User } from '../users/user.schema';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { AIService } from '../ai/ai.service';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private aiService: AIService,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    const existingChannel = await this.channelRepository.findOne({
      where: { name: createChannelDto.name }
    });

    if (existingChannel) {
      throw new ConflictException('Channel name is already taken');
    }

    const channel = this.channelRepository.create(createChannelDto);
    return this.channelRepository.save(channel);
  }

  async getAllChannels(): Promise<Channel[]> {
    return this.channelRepository.find({
      relations: ['posts'],
      order: { createdAt: 'DESC' },
    });
  }

  async getChannelById(id: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.author', 'posts.comments'],
    });
    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }
    return channel;
  }

  async createPost(createPostDto: CreatePostDto, authorId: number): Promise<Post> {
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const channel = await this.channelRepository.findOne({ where: { id: createPostDto.channelId } });
    if (!channel) {
      throw new NotFoundException(`Channel with ID ${createPostDto.channelId} not found`);
    }

    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      author,
      channel,
    });

    return this.postRepository.save(post);
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'channel', 'comments', 'comments.author'],
      order: { comments: { createdAt: 'ASC' } },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author', 'channel', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPostsByChannel(channelId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { channel: { id: channelId } },
      relations: ['author', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async markPostAsResolved(postId: number, userId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (post.author.id !== userId) {
      throw new NotFoundException('Only the post author can mark it as resolved');
    }

    post.isResolved = true;
    return this.postRepository.save(post);
  }

  async createComment(createCommentDto: CreateCommentDto, authorId: number): Promise<Comment> {
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const post = await this.postRepository.findOne({ where: { id: createCommentDto.postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${createCommentDto.postId} not found`);
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      author,
      post,
      isAiGenerated: createCommentDto.isAiGenerated || false,
    });

    return this.commentRepository.save(comment);
  }

  async acceptComment(commentId: number, postAuthorId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['post', 'post.author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    if (comment.post.author.id !== postAuthorId) {
      throw new NotFoundException('Only the post author can accept comments');
    }

    comment.isAccepted = true;
    return this.commentRepository.save(comment);
  }

  async getAiHelp(postId: number, userId: number): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const prompt = `Help solve this forum post:
Title: ${post.title}
Content: ${post.content}

Please provide a helpful solution or advice for this problem.`;

    const aiResponse = await this.aiService.generate(prompt);

    const aiComment = await this.createComment(
      {
        content: aiResponse,
        postId: postId,
        isAiGenerated: true,
      },
      userId,
    );

    return aiComment;
  }
}
