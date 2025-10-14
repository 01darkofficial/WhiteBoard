import { Schema, model } from "mongoose";
import { IInvitation } from "../utils/types";

const invitationSchema = new Schema<IInvitation>(
    {
        board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
        invitee: { type: Schema.Types.ObjectId, ref: "User", required: true },
        inviter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ['viewer', 'editor', 'admin'], default: "viewer" },
        boardPermissions: [{ type: String }],
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

const Invitation = model<IInvitation>("Invitation", invitationSchema);
export default Invitation;
