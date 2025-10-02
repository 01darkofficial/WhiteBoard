// models/BoardElement.ts
import mongoose, { Schema } from "mongoose";
import { IBoardElement } from "../utils/types";

const BoardElementSchema = new Schema<IBoardElement>(
    {
        board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, required: true, enum: ["stroke", "shape", "text", "sticky"] },
        data: { type: Schema.Types.Mixed, required: true }, // flexible JSON field
    },
    { timestamps: true }
);

export default mongoose.model<IBoardElement>("BoardElement", BoardElementSchema);
