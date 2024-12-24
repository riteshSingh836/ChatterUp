import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DB_URL;

export const connectToDatabase = async() => {
    try{
        await mongoose.connect(url);
        console.log("DB is connected");
    }catch(err) {
        console.log(err);
    }
}