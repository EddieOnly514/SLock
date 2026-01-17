import express from "express";
import { requireAuth } from "../middleware/auth";
import { createActivity, getActivities } from "../controllers/activitiesController";

const router = express.Router();

router.post('/', requireAuth, createActivity);
router.get('/', requireAuth, getActivities);

export default router;
