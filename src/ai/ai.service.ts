import { Injectable, UseGuards } from "@nestjs/common";
import {GoogleGenAI} from '@google/genai';

@Injectable()
export class AIService {
    async generate(prompt: string): Promise<string> {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: `${prompt}`,
        });
        
        return `${response.text}`;
    }
}