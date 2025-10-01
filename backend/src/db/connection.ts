import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI!, {
            autoIndex: process.env.NODE_ENV !== 'production',
        });
        console.log(`MongoDB connected : ${conn.connection.host}`);
    }catch(error){
        console.error(`Error ${(error as Error).message}`);
        process.exit(1);
    }
}

export default connectDB;