import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const authService = app.get(AuthService);
  try {
    await authService.seedInitialAdmin();
  } catch (error) {
    console.warn('⚠️  Failed to create initial admin user:', error.message);
  }
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Server is running on http://localhost:3000');
}
bootstrap();
