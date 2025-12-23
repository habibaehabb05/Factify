const DetectionStrategy = require('./DetectionStrategy');
const AIService = require('../services/aiservice');

class TextStrategy extends DetectionStrategy {
    async analyze(text) {
        console.log("Using Text Strategy...");
        // Singleton Access
        const aiService = AIService.getInstance();
        return await aiService.analyzeContent({ type: 'text', content: text });
    }
}

module.exports = TextStrategy;
