import express from 'express';
import multer from 'multer';
import { createPost, getPostById, getAllPosts, getAllPostsOneUser, updatePost, deletePostById} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, upload.single('photo'), createPost);
router.get('/:postId', protect, getPostById);
router.get('/', protect, getAllPosts)
router.get('/user/:userId', protect, getAllPostsOneUser);
router.put('/:postId', protect, upload.single("photo"), updatePost);
router.delete('/:postId', protect, deletePostById)

export default router;