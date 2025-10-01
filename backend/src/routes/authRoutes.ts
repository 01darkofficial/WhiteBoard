import { Router } from "express";
import { protect } from "../middleware/auth";
import { registerValidator, loginValidator } from "../validators/authValidator"
import { validate } from "../middleware/validation"
import { registerUser, loginUser, logoutUser, getUser } from "../controllers/authController";

const router = Router();

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', loginValidator, validate, loginUser);
router.get('/logout', protect, logoutUser);
router.get('/user', protect, getUser);

export default router;