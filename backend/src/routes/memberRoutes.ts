import express from "express"
import { protect } from "../middleware/auth"
import { addMember, removeMember } from "../controllers/memberController"
import { addMemberValidator } from "../validators/memberValidator"
import { validate } from "../middleware/validation"

const router = express.Router()

router.post('/addMember', protect, addMemberValidator, validate, addMember);
router.delete('/removeMember', protect, addMemberValidator, validate, removeMember);

export default router;