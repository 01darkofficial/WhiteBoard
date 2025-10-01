import mongoose, { Schema } from "mongoose"
import { IStroke } from "../utils/types";

const strokeSchema = new mongoose.Schema<IStroke>(
    {
        board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["pencil", "shape"], required: true },
        points: [
            {
                x: { type: Number, required: true },
                y: { type: Number, required: true },
            },
        ],
        color: { type: String, default: "#000000" },
        thickness: { type: Number, default: 2 },
    },
    { timestamps: true }
);

// Indexes to speed up querying strokes by board and user
strokeSchema.index({ board: 1 });
strokeSchema.index({ board: 1, user: 1 });
strokeSchema.index({ createdAt: 1 }); // Optional: for timeline/replay features


const Stroke = mongoose.model<IStroke>(
    "Stroke",
    strokeSchema
);

export default Stroke;