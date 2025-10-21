// routes/boardElementRoutes.ts
import express from "express";
import { createElement, getBoardElements, removeElement } from "../controllers/boardElementController";
import { createElementValidator } from "../validators/boardElementValidator";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validation";


const router = express.Router();

router.get("/:boardId/getElements", protect, getBoardElements);
router.post("/:boardId/createElement", protect, createElement);
router.delete("/:boardId/removeElement/:elementId", protect, removeElement);

export default router;
