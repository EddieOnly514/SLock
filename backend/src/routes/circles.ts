import express from 'express';
import { requireAuth } from '../middleware/auth';
import {
    createCircle,
    getCircles,
    getCircle,
    updateCircle,
    deleteCircle,
    addCircleMember,
    getCircleMembers,
    removeCircleMember,
} from '../controllers/circlesController';

const router = express.Router();

router.post('/', requireAuth, createCircle);
router.get('/', requireAuth, getCircles);
router.get('/:id', requireAuth, getCircle);
router.patch('/:id', requireAuth, updateCircle);
router.delete('/:id', requireAuth, deleteCircle);
router.post('/:id/members', requireAuth, addCircleMember);
router.get('/:id/members', requireAuth, getCircleMembers);
router.delete('/:id/members/:userId', requireAuth, removeCircleMember);

export default router;
