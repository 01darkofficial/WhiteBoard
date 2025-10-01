import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { AuthRequest, IUserDocument } from "../utils/types";


// Register a new user
// POST api/auth/resgister
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    console.log(user, 'user created');

    const token = generateToken(user.id.toString());

    // Set the token as an HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
    });
}

// Logging in user
// POST api/auth/login

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password') as IUserDocument;
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user.id.toString());

    // Set HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    console.log('logged in successfully');

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
    });


}

export const logoutUser = (req: Request, res: Response) => {
    console.log('logout');
    console.log(req.cookies);
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });
    res.clearCookie('jwt');
    res.status(200).json({ message: "Logged out successfully" });
}

export const getUser = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
}