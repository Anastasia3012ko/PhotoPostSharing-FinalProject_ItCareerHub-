import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout/:userId', protect, logoutUser);

export default router;
