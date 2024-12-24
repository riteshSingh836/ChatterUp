import mongoose from "mongoose";

export const connectToDatabase = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/chatterApp");
        console.log("DB is connected");
    }catch(err) {
        console.log(err);
    }
}