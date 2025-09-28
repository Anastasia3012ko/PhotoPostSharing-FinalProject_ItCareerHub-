import express from 'express';
import {
  getUserById,
  updateUser
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:userId', protect, getUserById);
router.put("/update/:userId", protect, upload.single("avatar"), updateUser);

export default router;


