import express from "express"
import { protect } from "../middleware/auth"
import { getNotifications, markRead, markAllRead, respondToNotification } from "../controllers/notificationController";

const router = express.Router()

router.get('/', protect, getNotifications);
router.patch('/markRead/:notificationId', protect, markRead);
router.patch('/markAllRead', protect, markAllRead);
router.patch('/respond/:notificationId', protect, respondToNotification);

export default router;