const DetectionStrategy = require('./DetectionStrategy');
const AIService = require('../services/aiservice');

class UrlStrategy extends DetectionStrategy {
    async analyze(url) {
        console.log("Using URL Strategy (Delegating to RAG)...");
        // Singleton Access
        const aiService = AIService.getInstance();
        return await aiService.analyzeContent({ type: 'url', content: url });
    }
}

module.exports = UrlStrategy;
