// controllers/boardElementController.ts
import { Request, Response } from "express";
import BoardElement from "../models/BoardElement";
import { AuthRequest } from "../utils/types";

export const createElement = async (req: AuthRequest, res: Response) => {
    const { type, data } = req.body;

    const { boardId } = req.params;

    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    try {
        console.log(req.params);
        const element = await BoardElement.create({
            board: boardId,
            user: req.user._id,
            type,
            data,
        });

        console.log("success, elem created")

        res.status(201).json(element);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save element" });
    }
};

export const getBoardElements = async (req: Request, res: Response) => {
    const { boardId } = req.params;

    try {
        const elements = await BoardElement.find({ board: boardId }).sort({ createdAt: 1 });
        console.log("success, got elems")
        res.json(elements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch elements" });
    }
};

export const removeElement = async (req: Request, res: Response) => {
    const { boardId, elementId } = req.params;
    // const { user } = req.body;

    if (!elementId) {
        return res.status(400).json({ message: "Element ID not provided" });
    }

    try {
        // Delete element by ID and board
        const deleted = await BoardElement.findOneAndDelete({ _id: elementId, board: boardId });

        if (!deleted) {
            return res.status(404).json({ message: "Element not found" });
        }

        res.json({ message: "Element deleted successfully" });
    } catch (err) {
        console.error("Failed to delete element:", err);
        res.status(500).json({ message: "Failed to delete element" });
    }
};



