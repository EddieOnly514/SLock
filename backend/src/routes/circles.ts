import express from 'express';
import { requireAuth } from '../middleware/auth';
import { createCircle, getCircles, getCircle } from '../controllers/circlesController';

const router = express.Router();

router.post('/', requireAuth, createCircle);
router.get('/', requireAuth, getCircles);
router.get('/:id', requireAuth, getCircle);

export default router;
