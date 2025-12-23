const axios = require('axios');

class AIService {
    constructor() {
        if (AIService.instance) {
            return AIService.instance;
        }
        AIService.instance = this;
        this.ragServiceUrl = process.env.RAG_SERVICE_URL || 'http://127.0.0.1:3002/analyze';
    }

    static getInstance() {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    /**
     * Call RAG Microservice for Analysis
     * @param {Object} input - { text, url, image_path, type }
     * @returns {Promise<Object>} - Analysis result
     */
    async analyzeContent(inputData) {
        console.log('[AI SERVICE DEBUG] Starting analysis');
        console.log('[AI SERVICE DEBUG] Input type:', inputData.type);
        console.log('[AI SERVICE DEBUG] Content preview:',
            inputData.type === 'image' ? `File path: ${inputData.content}` :
                inputData.content.substring(0, 100));

        try {
            // Prepare payload for Python API
            // CONTRACT: { type: "text"|"url"|"image", content: "...", preprocessing: "..." }
            const payload = {
                type: inputData.type,
                content: inputData.content,
                preprocessing: "clean"
            };

            // Handle Image Content specifically (File Path -> Base64)
            if (inputData.type === 'image' && inputData.content) {
                console.log('[AI SERVICE DEBUG] Converting image to base64');
                const fs = require('fs');
                // inputData.content is the filePath here
                const imageBuffer = fs.readFileSync(inputData.content);
                payload.content = imageBuffer.toString('base64');
                console.log('[AI SERVICE DEBUG] Base64 conversion complete, length:', payload.content.length);
            }

            console.log(`[AI SERVICE DEBUG] Sending request to RAG Service at ${this.ragServiceUrl}`);
            console.log('[AI SERVICE DEBUG] Payload type:', payload.type);

            const response = await axios.post(this.ragServiceUrl, payload);
            const data = response.data;

            console.log('[AI SERVICE DEBUG] RAG response received');
            console.log('[AI SERVICE DEBUG] Verdict:', data.verdict);
            console.log('[AI SERVICE DEBUG] Confidence:', data.confidence_score);
            console.log('[AI SERVICE DEBUG] Sources count:', data.sources?.length || 0);

            return {
                classification: data.verdict, // 'Real' or 'Fake'
                confidenceScore: data.confidence_score, // 0-100
                explanation: data.explanation,
                sources: data.sources,
                timestamp: new Date()
            };

        } catch (error) {
            console.error('[AI SERVICE ERROR] RAG Service Error:', error.message);
            if (error.response) {
                console.error('[AI SERVICE ERROR] Response status:', error.response.status);
                console.error('[AI SERVICE ERROR] Response data:', error.response.data);
            }

            // Fallback or Rethrow
            throw new Error("AI Service Unavailable: " + error.message);
        }
    }
}

module.exports = AIService;
