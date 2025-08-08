import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AIService } from "./ai.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('ai')
export class AIController{
    constructor(private readonly aiService:AIService){}
    @UseGuards(AuthGuard('jwt'))
    @Get('string')
   async getPrompt(@Query('prompt') prompt:string){
        return {result: await this.aiService.generate(prompt)};
    }

}

