import express from "express";
import { requireAuth } from "../middleware/auth";
import { getDailySummaries, generateOrUpdateDailySummary } from "../controllers/dailySummariesController";


const router = express.Router();

router.get('/', requireAuth, getDailySummaries);
router.post('/generate', requireAuth, generateOrUpdateDailySummary);

export default router;