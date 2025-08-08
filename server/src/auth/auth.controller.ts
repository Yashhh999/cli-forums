import { Body, Controller, Post, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "./admin.guard";
import { User } from "src/users/user.schema";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dto/create-user.dto";

@Controller('register')
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post()
    async create(@Body() createUserDto: CreateUserDto){
        return this.authService.Register(createUserDto);
    }
    
}

@Controller('auth')
export class AuthManagementController{
    constructor(private readonly authService:AuthService){}

    @Get('check-username')
    async checkUsername(@Query('username') username: string) {
        return this.authService.checkUsernameAvailability(username);
    }

    @Post('create-admin')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async createAdmin(@Body() createUserDto: CreateUserDto) {
        return this.authService.createAdmin(createUserDto);
    }
}

@Controller('login')
export class LoginController{
    
    constructor(private readonly authService:AuthService){}

    @Post()
    async login(@Body() body:{username:string, password:string}) {
        return this.authService.Login(body.username,body.password)
    }

}

