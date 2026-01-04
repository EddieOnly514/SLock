import express from "express";
import { getCatalog } from "../controllers/catalogController";

const router = express.Router();

router.get('/', getCatalog);

export default router;