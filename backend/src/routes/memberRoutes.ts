import express from "express"
import { protect } from "../middleware/auth"
import { addMember, removeMember } from "../controllers/memberController"
// import { addMemberValidator } from "../validators/memberValidator"
// import { validate } from "../middleware/validation"

const router = express.Router()

router.post('/:boardId/addMember', protect, addMember);
router.delete('/:boardId/removeMember', protect, removeMember);

export default router;