import { Request, Response } from "express";
import { AuthRequest, hasPermission } from "../utils/types";
import BoardChat from "../models/BoardChat";
import Board from "../models/Board";
import { Types } from "mongoose";


export const getBoardChat = async (req: AuthRequest, res: Response) => {
    try {
        const { boardId } = req.params;

        const board = await Board.findById(boardId);
        if (!board) return res.status(404).json({ message: "Board not found" });

        const chat = await BoardChat.findOne({ boardId });
        res.status(201).json(chat!.chats);
    }
    catch (err) {
        console.error("Error fetching board chat:", err);
        res.status(500).json({ error: "Couldn't fetch chats" });
    }
}

export const updateBoardChat = async (req: AuthRequest, res: Response) => {
    try {
        const { boardId } = req.params;
        const { username, msg } = req.body;

        if (!msg || typeof msg !== "string") {
            return res.status(400).json({ message: "Message is required and must be a string" });
        }

        const board = await Board.findById(boardId);
        if (!board) return res.status(404).json({ message: "Board not found" });

        // Check write permission
        if (!hasPermission(board, req.user!.id, ["comment", "admin", "edit"])) {
            return res.status(403).json({ message: "You do not have write permission" });
        }

        // Fetch the chat for the board
        let chat = await BoardChat.findOne({ boardId });
        if (!chat) {
            // If chat doesn't exist yet, create one
            chat = await BoardChat.create({ boardId, chats: [] });
        }

        // Append the new message
        const newMessage = {
            _id: new Types.ObjectId(),
            userId: req.user!.id,
            username: username,
            msg,
            timestamp: new Date(),
        };

        chat.chats = [...(chat.chats || []), newMessage];

        await chat.save();

        res.status(200).json(chat.chats);
    } catch (err) {
        console.error("Error updating board chat:", err);
        res.status(500).json({ error: "Couldn't update chats" });
    }
};
