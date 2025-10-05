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

export interface IBoardElement extends Document {
    board: Types.ObjectId;
    user: Types.ObjectId;
    type: "stroke" | "shape" | "text" | "sticky";
    data: any; // flexible for different element types
    createdAt: Date;
}

export interface AuthRequest extends Request {
    user?: IUser;
}
export interface AuthenticatedRequest extends Request {
    user: IUser;
}