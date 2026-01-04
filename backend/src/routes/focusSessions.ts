import express from 'express';
import { requireAuth } from '../middleware/auth';
import { 
    createFocusSession, 
    getFocusSession, 
    updateFocusSession } from '../controllers/focusSessionsController';

const router = express.Router();

router.get('/', requireAuth, getFocusSession);
router.post('/', requireAuth, createFocusSession);
router.patch('/:id', requireAuth, updateFocusSession);

export default router;