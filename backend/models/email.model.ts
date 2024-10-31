import mongoose, { Document, Schema } from 'mongoose';

interface EmailDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    address: string;
    createdAt: Date;
}

const emailSchema = new Schema<EmailDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    address: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Email = mongoose.model<EmailDocument>('Email', emailSchema);
export default Email;
export { EmailDocument, emailSchema };
