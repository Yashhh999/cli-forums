import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dto/create-user.dto";
import { User } from "src/users/user.schema";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { access } from "fs";

@Injectable()
export class AuthService{

    constructor( 
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService:JwtService,
    ){}

    async Register(createUserDto: CreateUserDto): Promise<User>{
        const hashedPassword = await bcrypt.hash(createUserDto.password,10);
        createUserDto.password = hashedPassword;
        const user=this.usersRepository.create(createUserDto);
        
        return this.usersRepository.save(user);        
    }

    async Login(username:string,password:string): Promise<any>{
        const user = await this.usersRepository.findOne({ where : {username}})
        if(!user){
            throw new Error('Invlaid User Credentials')
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            throw new Error('Invalid user credentials')
        }

        const payload ={username:user.username, sub:user.id }
        const token= this.jwtService.sign(payload);
        return {access_token:token};

        }


}
