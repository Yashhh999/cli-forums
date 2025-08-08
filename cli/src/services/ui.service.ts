import inquirer from 'inquirer';
import chalk from 'chalk';
import { AuthService } from './auth.service';
import { ForumService } from './forum.service';

export class UIService {
  async startInteractiveMode(authService: AuthService, forumService: ForumService): Promise<void> {
    console.log(chalk.cyan('\n🚀 Interactive Mode Started\n'));
    
    while (true) {
      try {
        const isLoggedIn = authService.requireAuth();
        
        const mainMenuChoices = [
          { name: '📋 List Channels', value: 'channels' },
          { name: '📝 List Posts', value: 'posts' },
          { name: '👁️  View Specific Post', value: 'view-post' },
        ];

        if (isLoggedIn) {
          mainMenuChoices.push(
            { name: '➕ Create Post', value: 'create-post' },
            { name: '💬 Add Comment', value: 'add-comment' },
            { name: '🤖 Get AI Help', value: 'ai-help' },
            { name: '✅ Mark Post Resolved', value: 'resolve-post' },
            { name: '🎯 Accept Comment', value: 'accept-comment' },
            { name: '📂 Create Channel (Admin)', value: 'create-channel' },
            { name: '👤 Show Profile', value: 'profile' },
            { name: '🚪 Logout', value: 'logout' }
          );
        } else {
          mainMenuChoices.push(
            { name: '🔐 Login', value: 'login' },
            { name: '📝 Register', value: 'register' }
          );
        }

        mainMenuChoices.push({ name: '❌ Exit', value: 'exit' });

        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: mainMenuChoices
          }
        ]);

        switch (action) {
          case 'channels':
            await forumService.listChannels();
            break;
          case 'posts':
            const { filterByChannel } = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'filterByChannel',
                message: 'Filter by specific channel?',
                default: false
              }
            ]);
            
            if (filterByChannel) {
              const { channelId } = await inquirer.prompt([
                {
                  type: 'input',
                  name: 'channelId',
                  message: 'Enter channel ID:',
                  validate: (input: string) => {
                    const num = parseInt(input);
                    return !isNaN(num) && num > 0 ? true : 'Please enter a valid channel ID';
                  }
                }
              ]);
              await forumService.listPosts(channelId);
            } else {
              await forumService.listPosts();
            }
            break;
          case 'view-post':
            const { postId } = await inquirer.prompt([
              {
                type: 'input',
                name: 'postId',
                message: 'Enter post ID:',
                validate: (input: string) => {
                  const num = parseInt(input);
                  return !isNaN(num) && num > 0 ? true : 'Please enter a valid post ID';
                }
              }
            ]);
            await forumService.viewPost(parseInt(postId));
            break;
          case 'create-post':
            await forumService.createPost();
            break;
          case 'add-comment':
            const { commentPostId } = await inquirer.prompt([
              {
                type: 'input',
                name: 'commentPostId',
                message: 'Enter post ID to comment on:',
                validate: (input: string) => {
                  const num = parseInt(input);
                  return !isNaN(num) && num > 0 ? true : 'Please enter a valid post ID';
                }
              }
            ]);
            await forumService.addComment(parseInt(commentPostId));
            break;
          case 'ai-help':
            const { aiHelpOption } = await inquirer.prompt([
              {
                type: 'list',
                name: 'aiHelpOption',
                message: 'Get AI help for:',
                choices: [
                  { name: 'Last viewed post', value: 'last' },
                  { name: 'Specific post ID', value: 'specific' }
                ]
              }
            ]);
            
            if (aiHelpOption === 'specific') {
              const { aiHelpPostId } = await inquirer.prompt([
                {
                  type: 'input',
                  name: 'aiHelpPostId',
                  message: 'Enter post ID for AI help:',
                  validate: (input: string) => {
                    const num = parseInt(input);
                    return !isNaN(num) && num > 0 ? true : 'Please enter a valid post ID';
                  }
                }
              ]);
              await forumService.getAiHelp(parseInt(aiHelpPostId));
            } else {
              await forumService.getAiHelp();
            }
            break;
          case 'resolve-post':
            const { resolvePostId } = await inquirer.prompt([
              {
                type: 'input',
                name: 'resolvePostId',
                message: 'Enter post ID to resolve:',
                validate: (input: string) => {
                  const num = parseInt(input);
                  return !isNaN(num) && num > 0 ? true : 'Please enter a valid post ID';
                }
              }
            ]);
            await forumService.resolvePost(parseInt(resolvePostId));
            break;
          case 'accept-comment':
            const { acceptCommentId } = await inquirer.prompt([
              {
                type: 'input',
                name: 'acceptCommentId',
                message: 'Enter comment ID to accept:',
                validate: (input: string) => {
                  const num = parseInt(input);
                  return !isNaN(num) && num > 0 ? true : 'Please enter a valid comment ID';
                }
              }
            ]);
            await forumService.acceptComment(parseInt(acceptCommentId));
            break;
          case 'create-channel':
            await forumService.createChannel();
            break;
          case 'profile':
            await authService.showProfile();
            break;
          case 'login':
            await authService.login();
            break;
          case 'register':
            await authService.register();
            break;
          case 'logout':
            await authService.logout();
            break;
          case 'exit':
            console.log(chalk.green('\nGoodbye! 👋'));
            return;
        }

        await inquirer.prompt([
          {
            type: 'input',
            name: 'continue',
            message: chalk.gray('Press Enter to continue...')
          }
        ]);

      } catch (error) {
        console.log(chalk.red('An error occurred:'), error);
        
        const { shouldContinue } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldContinue',
            message: 'Do you want to continue?',
            default: true
          }
        ]);

        if (!shouldContinue) {
          break;
        }
      }
    }
  }
}
