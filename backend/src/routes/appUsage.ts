import express from "express";
import { upsertAppUsage, getAppUsage } from "../controllers/appUsageController";
import { requireAuth } from "../middleware/auth"; 

const router = express.Router();

router.post('/', requireAuth, upsertAppUsage);
router.get('/', requireAuth, getAppUsage);

export default router;