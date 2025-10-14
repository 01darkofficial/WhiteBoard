import mongoose, { Schema } from "mongoose";
import { IBoard } from "../utils/types";

const boardSchema = new mongoose.Schema<IBoard>({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['viewer', 'editor', 'admin'], required: true },
        permissions: [{ type: String }]
    }],
    maxMembers: { type: Number },
}, { timestamps: true });

// index to find boards by owner or members quickly
boardSchema.index({ owner: 1 });
boardSchema.index({ "members.user": 1 });

const Board = mongoose.model<IBoard>('Board', boardSchema);
export default Board;