// src/validators/boardValidator.ts
import { body, param } from "express-validator";

// Create Board Validator
export const createBoardValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Board name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Board name must be 2-50 characters"),
];

// Delete Board Validator
// Get Board / Delete Board Validator
export const boardIdParamValidator = [
    param("boardId")
        .isMongoId()
        .withMessage("Invalid board ID"),
];
