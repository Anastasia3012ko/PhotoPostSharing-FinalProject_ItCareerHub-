import express from 'express';
import {
  getUserById,
  updateUser,
  followToUserById,
  getFollowers,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getUserById);
router.put('/:userId', protect, updateUser);
router.post('/:userId/follow', protect, followToUserById);
router.get('/:userId/followers', protect, getFollowers);

export default router;


