import { Response } from "express";
import Board from "../models/Board";
import Stroke from "../models/Stroke";
import { AuthRequest } from "../utils/types";

/**
 * Create a new board
 */
export const createBoard = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        const board = await Board.create({
            name,
            owner: req.user?._id,
            members: [{ user: req.user?._id, permission: "admin" }],
            maxMembers: 10,
        });
        res.status(201).json(board);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getBoards = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    try {
        const boards = await Board.find({
            $or: [
                { owner: userId },           // boards you own
                { "members.user": userId }   // boards you are a member of
            ]
        }).populate("members.user", "name email"); // optional: populate member info

        res.status(200).json(boards);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const deleteBoard = async (req: AuthRequest, res: Response) => {
    const { boardId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Only owner can delete
        if (board.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not the owner of this board" });
        }

        // Delete all strokes associated with the board
        await Stroke.deleteMany({ board: boardId });

        // Delete the board itself
        await board.deleteOne();

        return res.status(200).json({ message: "Board and all its strokes deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
