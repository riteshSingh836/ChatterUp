import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name is required"]},
    message: {type: String, required: [true, "Message is required"]},
    timestamp: Date
});

export const ChatModel = mongoose.model("Chat", chatSchema);