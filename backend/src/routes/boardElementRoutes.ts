// routes/boardElementRoutes.ts
import express from "express";
import { createElement, getBoardElements } from "../controllers/boardElementController";
import { createElementValidator } from "../validators/boardElementValidator";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validation";


const router = express.Router();

router.get("/:boardId/getElements", protect, getBoardElements);
router.post("/:boardId/createElement", protect, createElement);

export default router;
