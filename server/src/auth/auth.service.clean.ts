import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dto/create-user.dto";
import { User, UserRole } from "src/users/user.schema";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService{

    constructor( 
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService:JwtService,
    ){}

    async seedInitialAdmin(): Promise<void> {
        const adminExists = await this.usersRepository.findOne({
            where: { username: 'yash' }
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('yash', 10);
            const adminUser = this.usersRepository.create({
                username: 'yash',
                password: hashedPassword,
                role: UserRole.ADMIN
            });
            await this.usersRepository.save(adminUser);
            console.log('✅ Initial admin user "yash" created');
        } else {
            console.log('ℹ️  Admin user "yash" already exists');
        }
    }

    async Register(createUserDto: CreateUserDto): Promise<User>{
        const existingUser = await this.usersRepository.findOne({ 
            where: { username: createUserDto.username } 
        });
        
        if (existingUser) {
            throw new ConflictException('Username is already taken');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password,10);
        
        const user = this.usersRepository.create({
            username: createUserDto.username,
            password: hashedPassword,
            role: UserRole.USER 
        });
        
        return this.usersRepository.save(user);        
    }

    async Login(username:string,password:string): Promise<any>{
        const user = await this.usersRepository.findOne({ where : {username}})
        if(!user){
            throw new UnauthorizedException('Invalid User Credentials')
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            throw new UnauthorizedException('Invalid user credentials')
        }

        const payload = {
            username: user.username, 
            sub: user.id,
            role: user.role
        };
        const token= this.jwtService.sign(payload);
        return {
            access_token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
    }

    async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
        const existingUser = await this.usersRepository.findOne({ 
            where: { username } 
        });
        
        return { available: !existingUser };
    }

    async createAdmin(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ 
            where: { username: createUserDto.username } 
        });
        
        if (existingUser) {
            throw new ConflictException('Username is already taken');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        
        const adminUser = this.usersRepository.create({
            username: createUserDto.username,
            password: hashedPassword,
            role: UserRole.ADMIN
        });
        
        return this.usersRepository.save(adminUser);
    }
}
