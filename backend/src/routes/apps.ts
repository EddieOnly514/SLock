import express from "express";
import { requireAuth } from "../middleware/auth";
import { getUserApps, addUserApp, updateUserApp, deleteUserApp } from '../controllers/appsController';

const router = express.Router();

router.get('/', requireAuth, getUserApps);
router.post('/', requireAuth, addUserApp);
router.patch('/:id', requireAuth, updateUserApp);
router.delete('/:id', requireAuth, deleteUserApp);

export default router;