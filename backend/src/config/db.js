import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected successfully to mongoDB");

    } catch (error) {
        console.error("Failed to connection to mongoDB", error.message);
        
    }
}

export default connectToDatabase;