import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

const uploadAvatar = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new ApiError(400, 'Not an image! Please upload only images.'), false);
        }
    }
});

export default uploadAvatar;
