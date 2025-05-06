const { Configuration, OpenAIApi } = require('openai');
const { logger } = require('../utils');

class AIService {
    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.openai = new OpenAIApi(configuration);
    }

    async isJobRelated(content) {
        try {
            const response = await this.openai.createCompletion({
                model: "gpt-3.5-turbo",
                prompt: `Is this message about a job posting? Answer with yes or no only: ${content}`,
                max_tokens: 5,
                temperature: 0.3
            });
            
            const answer = response.data.choices[0].text.toLowerCase().trim();
            const isJob = answer.includes('yes');
            
            logger.info(`AI analysis result for content: ${isJob ? 'Job related' : 'Not job related'}`);
            return isJob;
        } catch (error) {
            logger.error(`Error in AI analysis: ${error.message}`);
            return false;
        }
    }

    async analyzeContent(content) {
        try {
            const response = await this.openai.createCompletion({
                model: "gpt-3.5-turbo",
                prompt: `Analyze this message and provide a brief summary: ${content}`,
                max_tokens: 100,
                temperature: 0.5
            });
            
            return response.data.choices[0].text.trim();
        } catch (error) {
            logger.error(`Error in content analysis: ${error.message}`);
            return null;
        }
    }
}

module.exports = new AIService(); 