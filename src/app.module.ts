import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AIModule } from './ai/ai.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.schema';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AIModule,
    TypeOrmModule.forFeature([User]),
    AuthModule
  ],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {}
