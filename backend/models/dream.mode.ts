import mongoose, { Schema, model } from "mongoose";
import { DreamDocument } from "../types/dream.types";

const DreamSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    likes: { 
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, { timestamps: true })

const Dream = model<DreamDocument>('Dream', DreamSchema)

export default Dream
export { DreamSchema }