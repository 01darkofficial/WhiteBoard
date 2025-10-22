// models/BoardElement.ts
import { model, Schema } from "mongoose";
import { IBoardChat } from "../utils/types";


const boardElementSchema = new Schema<IBoardChat>(
    {
        boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
        chats: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

const BoardChat = model<IBoardChat>("BoardChat", boardElementSchema);
export default BoardChat;
