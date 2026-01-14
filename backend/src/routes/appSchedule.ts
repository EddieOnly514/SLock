import express from "express";
import { requireAuth } from "../middleware/auth";
import { 
    getAppSchedules, 
    createAppSchedule, 
    updateAppSchedule, 
    deleteAppSchedule } from "../controllers/appScheduleController";

const router = express.Router();

router.get('/', requireAuth, getAppSchedules);
router.post('/', requireAuth, createAppSchedule);
router.patch('/:id', requireAuth, updateAppSchedule);
router.delete('/:id', requireAuth, deleteAppSchedule);

export default router;