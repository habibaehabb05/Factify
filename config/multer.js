import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Ensure 'uploads' folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. Storage Config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // submission-TIMESTAMP.ext
    cb(null, `submission-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 3. File Filter (Images + Docs)
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|pdf|doc|docx|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/') || 
                   file.mimetype.startsWith('application/') || 
                   file.mimetype.startsWith('text/');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only Images, PDFs, Docs, or Text files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;