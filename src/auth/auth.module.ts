import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController, LoginController } from './auth.controller';
import { User } from 'src/users/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions:{expiresIn:'1h'}
    })
],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController,LoginController],
})
export class AuthModule {}