import { Injectable, UseGuards } from "@nestjs/common";
import {GoogleGenAI} from '@google/genai';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class AIService {
    constructor(private configService: AppConfigService) {}

    async generate(prompt: string): Promise<string> {
        const GEMINI_API_KEY = this.configService.geminiApiKey;
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: `${prompt}`,
        });
        
        return `${response.text}`;
    }
}