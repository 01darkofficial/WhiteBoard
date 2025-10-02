// controllers/boardElementController.ts
import { Request, Response } from "express";
import BoardElement from "../models/BoardElement";
import { AuthRequest } from "../utils/types";

export const createElement = async (req: AuthRequest, res: Response) => {
    const { boardId, type, data } = req.body;

    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    try {
        const element = await BoardElement.create({
            board: boardId,
            user: req.user._id,
            type,
            data,
        });

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
        res.json(elements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch elements" });
    }
};
