import mongoose, { Document } from "mongoose";

interface DreamDocument extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    content: string;
    likes: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export { DreamDocument }