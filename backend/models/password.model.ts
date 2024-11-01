import mongoose, { Schema } from 'mongoose';
import { PasswordDocument } from '@b/types/password.types';


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
export { passwordSchema };
