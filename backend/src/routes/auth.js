import express from "express";
import { registerAccount } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerAccount);
// router.post("/login", loginAccount);

export default router;
