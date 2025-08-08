
import { program } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { AuthService } from './services/auth.service';
import { ForumService } from './services/forum.service';
import { UIService } from './services/ui.service';
import { ConfigService } from './services/config.service';

class ForumsCLI {
  private authService: AuthService;
  private forumService: ForumService;
  private uiService: UIService;
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    this.authService = new AuthService(this.configService);
    this.forumService = new ForumService(this.configService);
    this.uiService = new UIService();
  }

  async init() {
    console.log(
      chalk.cyan(
        figlet.textSync('CLI Forums', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default'
        })
      )
    );
    
    console.log(chalk.gray('Welcome to CLI Forums - Community help at your fingertips!\n'));

    program
      .name('forums')
      .description('CLI-based forum with AI integration')
      .version('1.0.0');

    program
      .command('register')
      .description('Register a new account')
      .action(async () => {
        await this.authService.register();
      });

    program
      .command('login')
      .description('Login to your account')
      .action(async () => {
        await this.authService.login();
      });

    program
      .command('logout')
      .description('Logout from your account')
      .action(async () => {
        await this.authService.logout();
      });

    program
      .command('channels')
      .description('List all channels')
      .action(async () => {
        await this.forumService.listChannels();
      });

    program
      .command('create-channel')
      .description('Create a new channel (admin only)')
      .action(async () => {
        await this.forumService.createChannel();
      });

    program
      .command('posts [channelId]')
      .description('List posts (optionally filter by channel)')
      .action(async (channelId) => {
        await this.forumService.listPosts(channelId);
      });

    program
      .command('create-post')
      .description('Create a new post')
      .action(async () => {
        await this.forumService.createPost();
      });

    program
      .command('view-post <postId>')
      .description('View a specific post with comments')
      .action(async (postId) => {
        await this.forumService.viewPost(parseInt(postId));
      });

    program
      .command('comment <postId>')
      .description('Add a comment to a post')
      .action(async (postId) => {
        await this.forumService.addComment(parseInt(postId));
      });

    program
      .command('ai-help [postId]')
      .description('Get AI help for a post (uses last viewed post if no ID provided)')
      .action(async (postId) => {
        await this.forumService.getAiHelp(postId ? parseInt(postId) : undefined);
      });

    program
      .command('resolve <postId>')
      .description('Mark a post as resolved (author only)')
      .action(async (postId) => {
        await this.forumService.resolvePost(parseInt(postId));
      });

    program
      .command('accept <commentId>')
      .description('Accept a comment as solution (post author only)')
      .action(async (commentId) => {
        await this.forumService.acceptComment(parseInt(commentId));
      });

    program
      .command('profile')
      .description('Show user profile')
      .action(async () => {
        await this.authService.showProfile();
      });

    program
      .command('interactive')
      .alias('i')
      .description('Start interactive mode')
      .action(async () => {
        await this.startInteractiveMode();
      });

    program.parse();
  }

  private async startInteractiveMode() {
    await this.uiService.startInteractiveMode(this.authService, this.forumService);
  }
}

const cli = new ForumsCLI();
cli.init().catch(console.error);