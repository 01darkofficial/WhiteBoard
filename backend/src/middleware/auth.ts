import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/User";
import { AuthRequest, IUserDocument } from "../utils/types";

interface jwtPayload {
    id: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    //  Get token from HTTP-only cookie
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwtPayload;

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password') as IUserDocument;

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Not authorized" });
    }
}
