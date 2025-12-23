const DetectionStrategy = require('./DetectionStrategy');
const AIService = require('../services/aiservice');

class ImageStrategy extends DetectionStrategy {
    /**
     * @param {string} imagePath - Path to uploaded image
     */
    async analyze(imagePath) {
        console.log("Using Image Strategy (Delegating to RAG)...");
        // Singleton Access
        const aiService = AIService.getInstance();
        return await aiService.analyzeContent({ type: 'image', content: imagePath });
    }
}

module.exports = ImageStrategy;
