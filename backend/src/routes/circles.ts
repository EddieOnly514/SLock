import express from 'express';
import { requireAuth } from '../middleware/auth';
import { createCircle, getCircles } from '../controllers/circlesController';

const router = express.Router();

router.post('/', requireAuth, createCircle);
router.get('/', requireAuth, getCircles);

export default router;
