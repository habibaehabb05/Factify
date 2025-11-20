import mongoose from 'mongoose';

const submissionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    inputType: {
      type: String,
      // Added 'file' to allow generic file uploads
      enum: ['text', 'url', 'image', 'file'], 
      required: true,
    },
    textContent: {
      type: String, // Stores text OR the specific URL if inputType is 'url'
      default: '', 
    },
    imagePath: {
      type: String, // Stores the path for Images AND PDFs/Docs
      default: '',
    },
    sourceUrl: {
      type: String, // Optional: If they want to add a source link with the file
      default: '',
    },
    result: {
      type: String,
      enum: ['Fake', 'Real', 'Uncertain', 'Pending'],
      default: 'Pending',
    },
    confidenceScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Submission', submissionSchema);