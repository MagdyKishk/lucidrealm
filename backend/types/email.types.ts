import mongoose from 'mongoose';

interface EmailDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    address: string;
    createdAt: Date;
    isValid: boolean;
    verifyCode?: string;
    verifyExpire?: Date;
}

export { EmailDocument };
