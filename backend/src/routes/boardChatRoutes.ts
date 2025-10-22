import { Router } from "express";
import { getBoardChat, updateBoardChat } from "../controllers/boardChatController";
import { protect } from "../middleware/auth";

const router = Router();

router.get('/:boardId/getChats', protect, getBoardChat);
router.patch('/:boardId/updateChats', protect, updateBoardChat);

export default router;