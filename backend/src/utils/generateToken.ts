import jwt from "jsonwebtoken";

export const generateToken = (id: string)=>{

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const expiresIn = '1d';

    const options: jwt.SignOptions = {
        expiresIn,
        algorithm: "HS256" 
    };

    return jwt.sign({ id }, secret, options);
}