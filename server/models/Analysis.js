const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inputType: { type: String, enum: ['text', 'url', 'image'], required: true },
    content: { type: String, required: true }, // The text or URL analyzed
    result: {
        classification: { type: String, enum: ['Fake', 'Real'] },
        confidenceScore: Number,
        explanation: String
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);
