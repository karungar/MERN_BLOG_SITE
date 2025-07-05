// config/multer.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const validTypes = /jpeg|jpg|png|gif/;
    const extValid = validTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = validTypes.test(file.mimetype);
    
    if (extValid && mimeValid) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  }
});

export default upload;