import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { IUserDocument } from "../utils/types";

const userSchema = new mongoose.Schema<IUserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    boardsCreated: { type: Number, default: 0 },
    activeBoards: { type: Number, default: 0 },
    joinedBoards: { type: Number, default: 0 },
    recentActivity: { type: [String], default: [] },
}, { timestamps: true });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;