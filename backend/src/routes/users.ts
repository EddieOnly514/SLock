import express from 'express';
import { requireAuth } from '../middleware/auth';
import { getUser } from '../controllers/usersController';

const router = express.Router();

router.get("/me", requireAuth, getUser);


export default router;