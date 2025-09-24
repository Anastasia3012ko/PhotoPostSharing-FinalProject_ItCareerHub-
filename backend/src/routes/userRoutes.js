import express from 'express';
import {
  getUserById,
  updateUser,
  followToUserById,
  getFollowers,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:userId', protect, getUserById);
router.put("/update/:userId", protect, upload.single("avatar"), updateUser);
router.post('/:userId/follow', protect, followToUserById);
router.get('/:userId/followers', protect, getFollowers);

export default router;


