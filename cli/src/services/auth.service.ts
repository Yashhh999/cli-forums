import axios from 'axios';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { ConfigService } from './config.service';

export class AuthService {
  constructor(private configService: ConfigService) {}

  async register(): Promise<void> {
    console.log(chalk.blue('\n📝 Register for CLI Forums\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Enter username:',
        validate: async (input: string) => {
          if (!input || input.length < 3) {
            return 'Username must be at least 3 characters long';
          }
          
          try {
            const response = await axios.get(
              `${this.configService.baseUrl}/auth/check-username?username=${input}`
            );
            if (!response.data.available) {
              return 'Username is already taken';
            }
            return true;
          } catch (error) {
            return 'Error checking username availability';
          }
        }
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter password:',
        validate: (input: string) => {
          if (!input || input.length < 6) {
            return 'Password must be at least 6 characters long';
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'confirmPassword',
        message: 'Confirm password:',
        validate: (input: string, answers: any) => {
          if (input !== answers.password) {
            return 'Passwords do not match';
          }
          return true;
        }
      }
    ]);

    const spinner = ora('Creating account...').start();

    try {
      const response = await axios.post(`${this.configService.baseUrl}/register`, {
        username: answers.username,
        password: answers.password
      });

      spinner.succeed('Account created successfully!');
      
      console.log(
        boxen(
          chalk.green(`Welcome ${answers.username}!\nYou can now login with your credentials.`),
          { padding: 1, borderColor: 'green', borderStyle: 'round' }
        )
      );
    } catch (error: any) {
      spinner.fail('Registration failed');
      if (error.response?.data?.message) {
        console.log(chalk.red(`Error: ${error.response.data.message}`));
      } else {
        console.log(chalk.red('An error occurred during registration'));
      }
    }
  }

  async login(): Promise<void> {
    if (this.configService.isLoggedIn()) {
      console.log(chalk.yellow(`Already logged in as ${this.configService.username}`));
      return;
    }

    console.log(chalk.blue('\n🔐 Login to CLI Forums\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Username:',
        validate: (input: string) => input ? true : 'Username is required'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
        validate: (input: string) => input ? true : 'Password is required'
      }
    ]);

    const spinner = ora('Logging in...').start();

    try {
      const response = await axios.post(`${this.configService.baseUrl}/login`, {
        username: answers.username,
        password: answers.password
      });

      this.configService.token = response.data.access_token;
      this.configService.username = response.data.user.username;
      this.configService.role = response.data.user.role;

      spinner.succeed('Login successful!');
      
      console.log(
        boxen(
          chalk.green(`Welcome back, ${answers.username}!\nRole: ${response.data.user.role}`),
          { padding: 1, borderColor: 'green', borderStyle: 'round' }
        )
      );
    } catch (error: any) {
      spinner.fail('Login failed');
      if (error.response?.data?.message) {
        console.log(chalk.red(`Error: ${error.response.data.message}`));
      } else {
        console.log(chalk.red('Invalid credentials'));
      }
    }
  }

  async logout(): Promise<void> {
    if (!this.configService.isLoggedIn()) {
      console.log(chalk.yellow('You are not logged in'));
      return;
    }

    const username = this.configService.username;
    this.configService.clearAuth();
    
    console.log(
      boxen(
        chalk.green(`Goodbye, ${username}!\nYou have been logged out successfully.`),
        { padding: 1, borderColor: 'blue', borderStyle: 'round' }
      )
    );
  }

  async showProfile(): Promise<void> {
    if (!this.configService.isLoggedIn()) {
      console.log(chalk.red('Please login first'));
      return;
    }

    console.log(
      boxen(
        chalk.cyan('👤 User Profile\n\n') +
        chalk.white(`Username: ${this.configService.username}\n`) +
        chalk.white(`Role: ${this.configService.role}\n`) +
        chalk.gray(`Server: ${this.configService.baseUrl}`),
        { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
      )
    );
  }

  requireAuth(): boolean {
    if (!this.configService.isLoggedIn()) {
      console.log(chalk.red('This command requires authentication. Please login first.'));
      console.log(chalk.gray('Use: forums login'));
      return false;
    }
    return true;
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.configService.token}`
    };
  }
}
