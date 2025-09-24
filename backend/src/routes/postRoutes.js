import express from 'express';
import multer from 'multer';
import { createPost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, upload.single('photo'), createPost);

export default router;