import fs from 'fs';
import path from 'path';
import os from 'os';

export interface UserConfig {
  token?: string;
  username?: string;
  role?: string;
  baseUrl: string;
  lastViewedPost?: number;
}

export class ConfigService {
  private configPath: string;
  private config: UserConfig;

  constructor() {
    this.configPath = path.join(os.homedir(), '.cli-forums.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): UserConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return { ...this.getDefaultConfig(), ...JSON.parse(data) };
      }
    } catch (error) {
      console.warn('Error loading config:', error);
    }
    return this.getDefaultConfig();
  }

  private getDefaultConfig(): UserConfig {
    return {
      baseUrl: process.env.FORUMS_API_URL || 'http://localhost:3000'
    };
  }

  saveConfig(): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get token(): string | undefined {
    return this.config.token;
  }

  set token(value: string | undefined) {
    this.config.token = value;
    this.saveConfig();
  }

  get username(): string | undefined {
    return this.config.username;
  }

  set username(value: string | undefined) {
    this.config.username = value;
    this.saveConfig();
  }

  get role(): string | undefined {
    return this.config.role;
  }

  set role(value: string | undefined) {
    this.config.role = value;
    this.saveConfig();
  }

  isLoggedIn(): boolean {
    return !!this.config.token;
  }

  clearAuth(): void {
    this.config.token = undefined;
    this.config.username = undefined;
    this.config.role = undefined;
    this.saveConfig();
  }

  get lastViewedPost(): number | undefined {
    return this.config.lastViewedPost;
  }

  set lastViewedPost(value: number | undefined) {
    this.config.lastViewedPost = value;
    this.saveConfig();
  }
}
