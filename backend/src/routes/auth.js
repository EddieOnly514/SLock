import express from 'express';
import { registerAccount, loginAccount } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post("/register", registerAccount);
router.post("/login", loginAccount);
// router.post('/refresh', refreshSession)

export default router;
