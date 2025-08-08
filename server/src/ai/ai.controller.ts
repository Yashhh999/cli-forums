import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AIService } from "./ai.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ai')
@Controller('ai')
export class AIController{
    constructor(private readonly aiService:AIService){}
    
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get('string')
    @ApiOperation({ summary: 'Generate AI response from prompt' })
    @ApiQuery({ name: 'prompt', type: 'string', description: 'The prompt to send to AI' })
    @ApiResponse({ status: 200, description: 'AI response generated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 400, description: 'Bad request - missing prompt' })
   async getPrompt(@Query('prompt') prompt:string){
        return {result: await this.aiService.generate(prompt)};
    }

}

