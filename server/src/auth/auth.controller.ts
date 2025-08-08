import { Body, Controller, Post, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "./admin.guard";
import { User } from "src/users/user.schema";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/dto/create-user.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('register')
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - invalid input' })
    @ApiResponse({ status: 409, description: 'Conflict - username already exists' })
    async create(@Body() createUserDto: CreateUserDto){
        return this.authService.Register(createUserDto);
    }
    
}

@ApiTags('auth')
@Controller('auth')
export class AuthManagementController{
    constructor(private readonly authService:AuthService){}

    @Get('check-username')
    @ApiOperation({ summary: 'Check if username is available' })
    @ApiQuery({ name: 'username', type: 'string', description: 'Username to check' })
    @ApiResponse({ status: 200, description: 'Username availability status' })
    @ApiResponse({ status: 400, description: 'Bad request - missing username' })
    async checkUsername(@Query('username') username: string) {
        return this.authService.checkUsernameAvailability(username);
    }

    @Post('create-admin')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new admin user (Admin only)' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'Admin user successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
    @ApiResponse({ status: 403, description: 'Forbidden - admin role required' })
    @ApiResponse({ status: 409, description: 'Conflict - username already exists' })
    async createAdmin(@Body() createUserDto: CreateUserDto) {
        return this.authService.createAdmin(createUserDto);
    }
}

@ApiTags('auth')
@Controller('login')
export class LoginController{
    
    constructor(private readonly authService:AuthService){}

    @Post()
    @ApiOperation({ summary: 'User login' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string', description: 'Username' },
                password: { type: 'string', description: 'Password' }
            },
            required: ['username', 'password']
        }
    })
    @ApiResponse({ status: 200, description: 'Login successful - returns JWT token' })
    @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
    async login(@Body() body:{username:string, password:string}) {
        return this.authService.Login(body.username,body.password)
    }

}

