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
    permission: "read" | "write" | "admin"; // restrict to known values
}

export interface IBoard extends Document {
    name: string;
    owner: Types.ObjectId;    // single owner (better than "owners")
    members: Member[];
    maxMembers: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStroke extends Document {
    board: Types.ObjectId; // which board this stroke belongs to
    user: Types.ObjectId;  // who drew it
    type: "pencil" | "line" | "rectangle"; // optional, for future
    points: { x: number; y: number }[];
    color: string;
    thickness: number;
    createdAt: Date;
}

export interface AuthRequest extends Request {
    user?: IUser;
}