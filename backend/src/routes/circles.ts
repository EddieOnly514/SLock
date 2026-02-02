import express from 'express';
import { requireAuth } from '../middleware/auth';
import { createCircle, getCircles, getCircle, updateCircle, deleteCircle } from '../controllers/circlesController';

const router = express.Router();

router.post('/', requireAuth, createCircle);
router.get('/', requireAuth, getCircles);
router.get('/:id', requireAuth, getCircle);
router.patch('/:id', requireAuth, updateCircle);
router.delete('/:id', requireAuth, deleteCircle);

export default router;
