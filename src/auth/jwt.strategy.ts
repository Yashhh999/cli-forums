import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTM5NzkzMzIsImV4cCI6MTc1Mzk4MjkzMiwiaXNzIjoieW91cl9pc3N1ZXIifQ.Y6Xrywexd8br08LIasiCuh9wK2Wlqb_RtfgTjwPW07MeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTM5NzkzMzIsImV4cCI6MTc1Mzk4MjkzMiwiaXNzIjoieW91cl9pc3N1ZXIifQ.Y6Xrywexd8br08LIasiCuh9wK2Wlqb_RtfgTjwPW07M'
        })

    }

        async validate(payload: any){
            return{userId:payload.sub,username: payload.username}
        }
    

}
