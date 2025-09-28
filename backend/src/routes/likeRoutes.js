import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { addLike, deleteLike } from '../controllers/likeController.js';

const router =express.Router();

router.post('/:id/like', protect, addLike);
router.delete('/:id/dislike', protect, deleteLike)

export default router;

