import mongoose, { Schema, model } from "mongoose";
import { DreamDocument } from "../types/dream.types";
import User from "./user.model";

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

DreamSchema.pre('deleteOne', async function(next) {
    const dream = this as unknown as DreamDocument;
    await User.updateOne({ _id: dream.userId }, { $pull: { dreams: dream._id } });
    next();
});

const Dream = model<DreamDocument>('Dream', DreamSchema)

export default Dream
export { DreamSchema }