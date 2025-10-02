// validators/boardElementValidator.ts
import { body } from "express-validator";

export const createElementValidator = [
    body("boardId")
        .notEmpty()
        .withMessage("Board ID is required")
        .isMongoId()
        .withMessage("Invalid Board ID"),

    body("type")
        .notEmpty()
        .withMessage("Type is required")
        .isIn(["stroke", "shape", "text", "sticky"])
        .withMessage("Invalid element type"),

    body("data")
        .notEmpty()
        .withMessage("Data is required")
        .custom((value, { req }) => {
            const { type } = req.body;

            if (type === "stroke") {
                if (
                    !Array.isArray(value.points) ||
                    typeof value.color !== "string" ||
                    typeof value.thickness !== "number"
                ) {
                    throw new Error("Invalid stroke data");
                }
            }

            if (type === "shape") {
                if (
                    typeof value.shapeType !== "string" ||
                    typeof value.x !== "number" ||
                    typeof value.y !== "number"
                ) {
                    throw new Error("Invalid shape data");
                }
            }

            if (type === "text") {
                if (
                    typeof value.text !== "string" ||
                    typeof value.x !== "number" ||
                    typeof value.y !== "number"
                ) {
                    throw new Error("Invalid text data");
                }
            }

            return true;
        }),
];
