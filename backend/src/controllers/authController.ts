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
        email: user.email,
        name: user.name
    });
}

// Logging in user
// POST api/auth/login

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password') as IUserDocument;
    if (!user) {
        return res.status(404).json({ message: "User does not exists" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
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
        email: user.email,
        name: user.name
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

export const updateUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    const { name, password, avatar } = req.body;

    try {
        const user = await User.findById(userId).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update username
        if (name && name !== user.name) {
            user.name = name;
        }

        // Update password (hashed)
        if (password) {
            user.password = password;
        }

        // Update avatar
        if (avatar) {
            user.avatar = avatar; // string URL or base64 string
        }

        await user.save();

        res.json(user);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    try {
        await User.findByIdAndDelete(userId);
        // Clear JWT cookie on delete
        res.cookie('jwt', '', { httpOnly: true, expires: new Date(0), path: '/' });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Server error" });
    }
};