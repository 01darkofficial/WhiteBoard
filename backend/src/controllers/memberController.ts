import { Response } from "express";
import Board from "../models/Board";
import { AuthRequest, Member } from "../utils/types";


/**
 * Add a member to a board
 */
export const addMember = async (req: AuthRequest, res: Response) => {
    const { boardId, userId, permission } = req.body;

    if (!req.user?._id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Only owner can add members
        if (board.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not the owner of this board" });
        }

        // Check if board is full
        if (board.members.length >= board.maxMembers) {
            return res.status(400).json({ message: "Board has reached maximum members" });
        }

        // Check if user is already a member
        const alreadyMember = board.members.some(
            (m: Member) => m.user.toString() === userId
        );
        if (alreadyMember) {
            return res.status(400).json({ message: "User is already a member" });
        }

        // Push new member
        board.members.push({ user: userId, permission });
        await board.save();

        return res.status(200).json(board);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
    const { boardId, userIds } = req.body;

    if (!req.user?._id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Only owner can remove members
        if (board.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not the owner of this board" });
        }

        // Remove members
        board.members = board.members.filter(
            (m: Member) => !userIds.includes(m.user.toString())
        );
        await board.save();

        return res.status(200).json(board);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};