const AnalysisSubject = require('../observers/AnalysisSubject');
const HistoryObserver = require('../observers/HistoryObserver');
const DetectionContext = require('../strategies/DetectionContext');
const TextStrategy = require('../strategies/TextStrategy');
const UrlStrategy = require('../strategies/UrlStrategy');
const ImageStrategy = require('../strategies/ImageStrategy');

// Initialize Observer Pattern components
const subject = new AnalysisSubject();
const historyObserver = new HistoryObserver();
subject.subscribe(historyObserver);

/**
 * @desc    Analyze content (Text, URL, or Image)
 * @route   POST /api/analyze
 * @access  Public (Guest) / Private (User History)
 */
const analyzeContent = async (req, res) => {
    console.log('\n[CONTROLLER DEBUG] ========== NEW ANALYSIS REQUEST ==========');
    console.log('[CONTROLLER DEBUG] Request body:', req.body);
    console.log('[CONTROLLER DEBUG] Has file:', !!req.file);
    console.log('[CONTROLLER DEBUG] User authenticated:', !!req.user);

    try {
        const { type, content } = req.body;
        console.log('[CONTROLLER DEBUG] Analysis type:', type);
        console.log('[CONTROLLER DEBUG] Content preview:', content ? content.substring(0, 50) : 'N/A');

        // User is optional (Guest Access)
        const userId = req.user ? req.user._id : null;

        // Strategy Pattern: Context
        const context = new DetectionContext();

        // Select Strategy
        console.log('[CONTROLLER DEBUG] Selecting strategy for type:', type);
        switch (type) {
            case 'text':
                context.setStrategy(new TextStrategy());
                break;
            case 'url':
                context.setStrategy(new UrlStrategy());
                break;
            case 'image':
                context.setStrategy(new ImageStrategy());
                break;
            default:
                console.log('[CONTROLLER ERROR] Invalid analysis type:', type);
                return res.status(400).json({ message: 'Invalid analysis type' });
        }

        // Execute Strategy
        // For images, content might be the file path if handled by multer
        let inputData = content;
        if (type === 'image' && req.file) {
            inputData = req.file.path;
            console.log('[CONTROLLER DEBUG] Image file path:', inputData);
        }

        console.log('[CONTROLLER DEBUG] Executing strategy with input...');
        const result = await context.executeStrategy(inputData);
        console.log('[CONTROLLER DEBUG] Strategy execution complete, result:', result);

        // Observer Pattern: Notify Observers (Only if user is logged in)
        if (userId) {
            console.log('[CONTROLLER DEBUG] Notifying observers for logged-in user');
            await subject.notify({
                userId,
                inputType: type,
                content: type === 'image' ? req.file.path : content,
                result
            });
        }

        console.log('[CONTROLLER DEBUG] Sending response to client');
        console.log('[CONTROLLER DEBUG] ========== REQUEST COMPLETE ==========\n');
        res.json(result);

    } catch (error) {
        console.error('[CONTROLLER ERROR] Analysis failed:', error);
        console.error('[CONTROLLER ERROR] Error stack:', error.stack);
        res.status(500).json({ message: 'Analysis failed', error: error.message });
    }
};

/**
 * @desc    Get user history
 * @route   GET /api/analyze/history
 * @access  Private
 */
const getHistory = async (req, res) => {
    const Analysis = require('../models/Analysis');
    try {
        const history = await Analysis.find({ userId: req.user._id }).sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};

module.exports = { analyzeContent, getHistory };
