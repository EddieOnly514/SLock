import express from "express";
import { sendFriendRequest, getFriends, updateFriendRequest, deleteFriendRequest } from "../controllers/friendsController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post('/', requireAuth, sendFriendRequest);
router.get('/', requireAuth, getFriends);
router.patch('/:id', requireAuth, updateFriendRequest);
router.delete('/:id', requireAuth, deleteFriendRequest);

export default router;