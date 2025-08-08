import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('CLI Forums API')
    .setDescription('A comprehensive forum API with AI integration for command-line interfaces')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('forums', 'Forum management endpoints')
    .addTag('ai', 'AI integration endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const authService = app.get(AuthService);
  try {
    await authService.seedInitialAdmin();
  } catch (error) {
    console.warn('⚠️  Failed to create initial admin user:', error.message);
  }
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Server is running on http://localhost:3000');
  console.log('📚 API Documentation available at http://localhost:3000/api');
}
bootstrap();
