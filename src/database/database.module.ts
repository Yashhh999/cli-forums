import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:"postgres://neondb_owner:npg_0Q1LNVcmjkep@ep-curly-star-a4rdrgic-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require", 
      autoLoadEntities: true,
      synchronize: true, //false - prod
      ssl: { rejectUnauthorized: false }, 
    }),
  ],
})
export class DatabaseModule {}