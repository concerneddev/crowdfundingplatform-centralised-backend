import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        cb(null, 'uploads/campaigns/');
      } catch (err) {
        console.error('Error setting destination:', err);
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      try {
        cb(null, Date.now() + path.extname(file.originalname));
      } catch (err) {
        console.error('Error setting filename:', err);
        cb(err);
      }
    },
  });
  

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;