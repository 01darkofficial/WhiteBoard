import { Document, Types } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
    matchPassword(password: string): Promise<boolean>;
}

export interface Member {
    user: Types.ObjectId;     // reference to User
    role: 'viewer' | 'editor' | 'admin'; // restrict to known values
    permissions: string[];
}

export interface IBoard extends Document {
    name: string;
    owner: Types.ObjectId;    // single owner (better than "owners")
    members: Member[];
    maxMembers: number;
    createdAt: Date;
    updatedAt: Date;
}

export type ToolType = "pencil" | "eraser" | "circle" | "rectangle" | "line" | "stroke" | "text" | "sticky";

export interface IBoardElement extends Document {
    board: Types.ObjectId;
    user: Types.ObjectId;
    type: ToolType;
    data: any; // flexible for different element types
    createdAt: Date;
}

export interface AuthRequest extends Request {
    user?: IUser;
}
export interface AuthenticatedRequest extends Request {
    user: IUser;
}

export interface IInvitation extends Document {
    board: Types.ObjectId;          // Reference to the board
    invitee: Types.ObjectId;        // User being invited
    inviter: Types.ObjectId;        // User sending the invite
    role: 'viewer' | 'editor' | 'admin'; // Role in the board (editor/viewer/etc)
    boardPermissions: string[];      // Optional permissions
    status: "pending" | "accepted" | "rejected"; // Invitation status
    createdAt: Date;
    updatedAt: Date;
}

export const INOTIFICATION_TYPES = ["invite", "mention", "merge", "alert", "notify"] as const;
export type NotificationType = (typeof INOTIFICATION_TYPES)[number];

export interface INotification extends Document {
    userId: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    relatedInvitation?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    timeAgo?: string; // Virtual field
}
