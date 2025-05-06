import OpenAI from 'openai';
import { logger } from '../utils';

class AIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async isJobRelated(content: string): Promise<boolean> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `Is this message about a job posting? Answer with yes or no only: ${content}`
                }],
                max_tokens: 5,
                temperature: 0.3
            });
            
            const answer = response.choices[0].message.content?.toLowerCase().trim() || '';
            const isJob = answer.includes('yes');
            
            logger.info(`AI analysis result for content: ${isJob ? 'Job related' : 'Not job related'}`);
            return isJob;
        } catch (error) {
            logger.error(`Error in AI analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    }

    async analyzeContent(content: string): Promise<string | null> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `Analyze this message and provide a brief summary: ${content}`
                }],
                max_tokens: 100,
                temperature: 0.5
            });
            
            return response.choices[0].message.content?.trim() || null;
        } catch (error) {
            logger.error(`Error in content analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
        }
    }
}

export default new AIService(); 