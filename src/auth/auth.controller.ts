import { Body, Controller, Post } from "@nestjs/common";
import { User } from "src/users/user.schema";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dto/create-user.dto";
import { createUserContent } from "@google/genai";

@Controller('register')
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post()
        async create(@Body() createUserDto: CreateUserDto){
            return this.authService.Register(createUserDto);
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

