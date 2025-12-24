import express from 'express';
import { requireAuth } from '../middleware/auth';
import { getUser, updateUser } from '../controllers/usersController';

const router = express.Router();

router.get("/me", requireAuth, getUser);
router.patch("/me", requireAuth, updateUser);

export default router;