import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';
import boxen from 'boxen';
import { ConfigService } from './config.service';

export class ForumService {
  constructor(private configService: ConfigService) {}

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.configService.token}`
    };
  }

  private requireAuth(): boolean {
    if (!this.configService.isLoggedIn()) {
      console.log(chalk.red('This command requires authentication. Please login first.'));
      return false;
    }
    return true;
  }

  async listChannels(): Promise<void> {
    const spinner = ora('Loading channels...').start();

    try {
      const response = await axios.get(`${this.configService.baseUrl}/forums/channels`);
      const channels = response.data;

      spinner.stop();

      if (channels.length === 0) {
        console.log(chalk.yellow('No channels found'));
        return;
      }

      const tableData = [
        ['ID', 'Name', 'Description', 'Posts', 'Created'],
        ...channels.map((channel: any) => [
          channel.id,
          chalk.cyan(channel.name),
          channel.description,
          channel.posts?.length || 0,
          new Date(channel.createdAt).toLocaleDateString()
        ])
      ];

      console.log(chalk.green('\n📂 Available Channels\n'));
      console.log(table(tableData));
    } catch (error: any) {
      spinner.fail('Failed to load channels');
      console.log(chalk.red(error.response?.data?.message || 'An error occurred'));
    }
  }

  async createChannel(): Promise<void> {
    if (!this.requireAuth()) return;

    if (this.configService.role !== 'admin') {
      console.log(chalk.red('Only administrators can create channels'));
      return;
    }

    console.log(chalk.blue('\n📂 Create New Channel\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Channel name:',
        validate: (input: string) => input ? true : 'Channel name is required'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Channel description:',
        validate: (input: string) => input ? true : 'Channel description is required'
      }
    ]);

    const spinner = ora('Creating channel...').start();

    try {
      const response = await axios.post(
        `${this.configService.baseUrl}/forums/channels`,
        answers,
        { headers: this.getAuthHeaders() }
      );

      spinner.succeed('Channel created successfully!');
      
      console.log(
        boxen(
          chalk.green(`Channel "${answers.name}" has been created!`),
          { padding: 1, borderColor: 'green', borderStyle: 'round' }
        )
      );
    } catch (error: any) {
      spinner.fail('Failed to create channel');
      console.log(chalk.red(error.response?.data?.message || 'An error occurred'));
    }
  }

  async listPosts(channelId?: string): Promise<void> {
    const spinner = ora('Loading posts...').start();

    try {
      const url = channelId 
        ? `${this.configService.baseUrl}/forums/channels/${channelId}/posts`
        : `${this.configService.baseUrl}/forums/posts`;
      
      const response = await axios.get(url);
      const posts = response.data;

      spinner.stop();

      if (posts.length === 0) {
        console.log(chalk.yellow('No posts found'));
        return;
      }

      const tableData = [
        ['ID', 'Title', 'Author', 'Channel', 'Comments', 'Status', 'Created'],
        ...posts.map((post: any) => [
          post.id,
          chalk.cyan(post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title),
          post.author?.username || 'Unknown',
          post.channel?.name || 'Unknown',
          post.comments?.length || 0,
          post.isResolved ? chalk.green('✓ Resolved') : chalk.yellow('○ Open'),
          new Date(post.createdAt).toLocaleDateString()
        ])
      ];

      console.log(chalk.green('\n📝 Posts\n'));
      console.log(table(tableData));
      console.log(chalk.gray('\nUse "forums view-post <id>" to read a specific post'));
    } catch (error: any) {
      spinner.fail('Failed to load posts');
      console.log(chalk.red(error.response?.data?.message || 'An error occurred'));
    }
  }

  async createPost(): Promise<void> {
    if (!this.requireAuth()) return;

    try {
      const channelsResponse = await axios.get(`${this.configService.baseUrl}/forums/channels`);
      const channels = channelsResponse.data;

      if (channels.length === 0) {
        console.log(chalk.red('No channels available. Please contact an admin to create channels.'));
        return;
      }

      console.log(chalk.blue('\n📝 Create New Post\n'));

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'channelId',
          message: 'Select channel:',
          choices: channels.map((channel: any) => ({
            name: `${channel.name} - ${channel.description}`,
            value: channel.id
          }))
        },
        {
          type: 'input',
          name: 'title',
          message: 'Post title:',
          validate: (input: string) => input ? true : 'Title is required'
        },
        {
          type: 'input',
          name: 'content',
          message: 'Post content (use \\n for line breaks):',
          validate: (input: string) => input ? true : 'Content is required',
          transformer: (input: string) => input.replace(/\\n/g, '\n')
        }
      ]);

      const spinner = ora('Creating post...').start();

      const response = await axios.post(
        `${this.configService.baseUrl}/forums/posts`,
        answers,
        { headers: this.getAuthHeaders() }
      );

      spinner.succeed('Post created successfully!');
      
      console.log(
        boxen(
          chalk.green(`Post "${answers.title}" has been created!\nPost ID: ${response.data.id}`),
          { padding: 1, borderColor: 'green', borderStyle: 'round' }
        )
      );
    } catch (error: any) {
      console.log(chalk.red(error.response?.data?.message || 'An error occurred'));
    }
  }

  async viewPost(postId: number): Promise<void> {
    const spinner = ora('Loading post...').start();

    try {
      const response = await axios.get(`${this.configService.baseUrl}/forums/posts/${postId}`);
      const post = response.data;

      this.configService.lastViewedPost = postId;

      spinner.stop();

      console.log(
        boxen(
          chalk.cyan(`📝 ${post.title}\n\n`) +
          chalk.white(`Author: ${post.author?.username}\n`) +
          chalk.white(`Channel: ${post.channel?.name}\n`) +
          chalk.white(`Status: ${post.isResolved ? chalk.green('✓ Resolved') : chalk.yellow('○ Open')}\n`) +
          chalk.white(`Created: ${new Date(post.createdAt).toLocaleString()}\n\n`) +
          chalk.gray('Content:\n') +
          chalk.white(post.content),
          { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
        )
      );

      if (post.comments && post.comments.length > 0) {
        console.log(chalk.green(`\n💬 Comments (${post.comments.length}):\n`));
        
        post.comments.forEach((comment: any, index: number) => {
          const status = comment.isAccepted ? chalk.green(' ✓ ACCEPTED') : '';
          const aiTag = comment.isAiGenerated ? chalk.blue(' 🤖 AI') : '';
          
          console.log(
            boxen(
              chalk.white(`#${index + 1} ${comment.author?.username}${status}${aiTag}\n`) +
              chalk.gray(`${new Date(comment.createdAt).toLocaleString()}\n\n`) +
              chalk.white(comment.content),
              { padding: 1, borderColor: comment.isAccepted ? 'green' : 'gray', borderStyle: 'single' }
            )
          );
        });
      } else {
        console.log(chalk.gray('\nNo comments yet.'));
      }

      console.log(chalk.gray('\nCommands:'));
      console.log(chalk.gray('- forums comment ' + postId + ' (add comment)'));
      console.log(chalk.gray('- forums ai-help (get AI help)'));
      if (this.configService.username === post.author?.username) {
        console.log(chalk.gray('- forums resolve ' + postId + ' (mark as resolved)'));
      }
    } catch (error: any) {
      spinner.fail('Failed to load post');
      console.log(chalk.red(error.response?.data?.message || 'Post not found'));
    }
  }

  async addComment(postId: number): Promise<void> {
    if (!this.requireAuth()) return;

    console.log(chalk.blue(`\n💬 Add Comment to Post #${postId}\n`));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'content',
        message: 'Comment content (use \\n for line breaks):',
        validate: (input: string) => input ? true : 'Content is required',
        transformer: (input: string) => input.replace(/\\n/g, '\n')
      }
    ]);

    const spinner = ora('Adding comment...').start();

    try {
      const response = await axios.post(
        `${this.configService.baseUrl}/forums/comments`,
        { content: answers.content, postId },
        { headers: this.getAuthHeaders() }
      );

      spinner.succeed('Comment added successfully!');
      
      console.log(
        boxen(
          chalk.green('Your comment has been added!'),
          { padding: 1, borderColor: 'green', borderStyle: 'round' }
        )
      );
    } catch (error: any) {
      spinner.fail('Failed to add comment');
      console.log(chalk.red(error.response?.data?.message || 'An error occurred'));
    }
  }

  async getAiHelp(postId?: number): Promise<void> {
    if (!this.requireAuth()) return;

    const targetPostId = postId || this.configService.lastViewedPost;
    
    if (!targetPostId) {
      console.log(chalk.red('No post to get AI help for. Please view a post first or provide a post ID.'));
      console.log(chalk.gray('Usage: forums view-post <id> then forums ai-help'));
      console.log(chalk.gray('   or: forums ai-help <id>'));
      return;
    }

    const spinner = ora('Getting AI help...').start();

    try {
      const response = await axios.post(
        `${this.configService.baseUrl}/forums/posts/${targetPostId}/ai-help`,
        {},
        { headers: this.getAuthHeaders() }
      );

      spinner.succeed('AI help added as comment!');
      
      console.log(
        boxen(
          chalk.green('🤖 AI has analyzed the post and added a helpful comment!'),
          { padding: 1, borderColor: 'blue', borderStyle: 'round' }
        )
      );
      
      console.log(chalk.gray('Use "forums view-post ' + targetPostId + '" to see the AI response'));
    } catch (error: any) {
      spinner.fail('Failed to get AI help');
      console.log(chalk.red(error.response?.data?.message || 'An error occurred'));
    }
  }

  async resolvePost(postId: number): Promise<void> {
    if (!this.requireAuth()) return;

    const spinner = ora('Marking post as resolved...').start();

    try {
      const response = await axios.patch(
        `${this.configService.baseUrl}/forums/posts/${postId}/resolve`,
        {},
        { headers: this.getAuthHeaders() }
      );

      spinner.succeed('Post marked as resolved!');
      
      console.log(
        boxen(
          chalk.green('✓ Post has been marked as resolved!'),
          { padding: 1, borderColor: 'green', borderStyle: 'round' }
        )
      );
    } catch (error: any) {
      spinner.fail('Failed to resolve post');
      console.log(chalk.red(error.response?.data?.message || 'Only the post author can resolve posts'));
    }
  }

  async acceptComment(commentId: number): Promise<void> {
    if (!this.requireAuth()) return;

    const spinner = ora('Accepting comment as solution...').start();

    try {
      const response = await axios.patch(
        `${this.configService.baseUrl}/forums/comments/${commentId}/accept`,
        {},
        { headers: this.getAuthHeaders() }
      );

      spinner.succeed('Comment accepted as solution!');
      
      console.log(
        boxen(
          chalk.green('✓ Comment has been accepted as the solution!'),
          { padding: 1, borderColor: 'green', borderStyle: 'round' }
        )
      );
    } catch (error: any) {
      spinner.fail('Failed to accept comment');
      console.log(chalk.red(error.response?.data?.message || 'Only the post author can accept comments'));
    }
  }
}
