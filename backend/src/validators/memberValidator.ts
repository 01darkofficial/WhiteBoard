import { body } from "express-validator";

// Add Member Validator
export const addMemberValidator = [
    body("boardId")
        .isMongoId()
        .withMessage("Invalid board ID"),
    body("userId")
        .isMongoId()
        .withMessage("Invalid user ID"),
    body("permission")
        .isIn(["read", "write", "admin"])
        .withMessage("Invalid permission value"),
];

// Remove Member Validator
export const removeMemberValidator = [
    body("boardId")
        .isMongoId()
        .withMessage("Invalid board ID"),
    body("userId")
        .isMongoId()
        .withMessage("Invalid user ID"),
];