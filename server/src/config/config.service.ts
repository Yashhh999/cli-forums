import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'fallback-secret-key';
  }

  get geminiApiKey(): string {
    return this.configService.get<string>('GEMINI_API_KEY') || '';
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }
}
