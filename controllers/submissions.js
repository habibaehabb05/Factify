import Submission from '../models/submissions.js';

// @desc    Create a new submission
// @route   POST /api/submissions
export const createSubmission = async (req, res) => {
  try {
    // We extract 'sourceUrl' now as well, just in case they sent one
    const { inputType, textContent, sourceUrl } = req.body;
    let filePath = '';

    // Validation Logic
    // We check for 'image' OR 'file'
    if (inputType === 'image' || inputType === 'file') {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file (Image, PDF, Doc, or Text)' });
      }
      filePath = req.file.path; // Multer gives us this path
    } 
    else if ((inputType === 'text' || inputType === 'url') && !textContent) {
      return res.status(400).json({ message: 'Please provide text or URL content' });
    }

    // Create Database Entry
    const submission = await Submission.create({
      user: req.user._id,
      inputType,
      textContent: textContent || '',
      imagePath: filePath, // Saves the path to the image OR pdf/doc
      sourceUrl: sourceUrl || '', // Saves optional source URL
      result: 'Pending',
    });

    res.status(201).json({
      message: 'Submission received!',
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get history
// @route   GET /api/submissions
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};