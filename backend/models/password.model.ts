import mongoose, { Document, Schema } from 'mongoose';

interface PasswordDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    hash: string;
    createdAt: Date;
}

const passwordSchema = new Schema<PasswordDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    hash: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Password = mongoose.model<PasswordDocument>('Password', passwordSchema);
export default Password;
export { PasswordDocument, passwordSchema };
