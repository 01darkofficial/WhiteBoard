// routes/boardElementRoutes.ts
import express from "express";
import { createElement, getBoardElements } from "../controllers/boardElementController";
import { createElementValidator } from "../validators/boardElementValidator";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validation";


const router = express.Router();

router.post("/createElement", protect, createElementValidator, validate, createElement);
router.get("/:boardId", protect, getBoardElements);

export default router;
