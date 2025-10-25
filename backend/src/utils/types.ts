import { Document, Types } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;
    boardsCreated: number;         // total boards created by the user
    activeBoards: number;          // number of boards currently active
    joinedBoards: number;          // number of boards user has joined
    recentActivity: string[];      // array of activity descriptions
    readonly createdAt: Date;  // fixed
    updatedAt: Date;           // automatically updated by Mongoose
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

export interface IChat {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    username: string;
    msg: string;
    // createdAt: Date;
}

export interface IBoardChat extends Document {
    boardId: Types.ObjectId;
    chats: IChat[];
    createdAt: Date;
}

export function hasPermission(board: IBoard, userId: string, permissions: string[]) {
    const member = board.members.find(
        (m) => m.user.toString() === userId.toString()
    );
    if (!member) return false;

    // Return true if any of the requested permissions exist in member.permissions
    return permissions.some((perm) => member.permissions.includes(perm));
}

