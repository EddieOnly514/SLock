import express from 'express';
import { requireAuth } from '../middleware/auth';
import { createCircle } from '../controllers/circlesController';

const router = express.Router();

router.post('/', requireAuth, createCircle);

export default router;
