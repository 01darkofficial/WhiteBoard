import express from "express"
import { protect } from "../middleware/auth"
import { createBoard, getBoards, deleteBoard, getBoardById } from "../controllers/boardController"
import { createBoardValidator, boardIdParamValidator } from "../validators/boardValidator"
import { validate } from "../middleware/validation"

const router = express.Router()

router.post('/create', protect, createBoardValidator, validate, createBoard);
router.get('/', protect, getBoards);
router.delete('/:boardId', protect, boardIdParamValidator, validate, deleteBoard);
router.get('/:boardId', protect, boardIdParamValidator, validate, getBoardById);

export default router;