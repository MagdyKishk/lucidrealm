import mongoose, { Document, Schema } from 'mongoose';
import generateRandomToken from '@b/utils/generateRandomToken';
import { EmailDocument } from '@b/types/email.types';

const emailSchema = new Schema<EmailDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    address: {
        type: String,
        required: true,
    },
    isValid: {
        type: Boolean,
        default: false,
    },
    verifyCode: {
        type: String,
        default: () => generateRandomToken(8),
    },
    verifyExpire: {
        type: Date,
        default: () => Date.now() + (1000 * 60 *60 * 24) // valid for 1d
    },
    deletionDate: {
        type: Date,
        default: () => Date.now() + (1000 * 60 * 60 * 24) // valid for 1d
    }
}, { timestamps: true });

const Email = mongoose.model<EmailDocument>('Email', emailSchema);

export default Email;
export { emailSchema };
