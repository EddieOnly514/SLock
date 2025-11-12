import express from "express";
import { registerAccount, loginAccount, refreshSession, logoutAccount } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerAccount);
router.post("/login", loginAccount);
router.post("/refresh", refreshSession);
router.post("/logout", requireAuth, logoutAccount);

export default router;
