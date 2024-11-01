import mongoose from 'mongoose';

interface PasswordDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    hash: string;
    createdAt: Date;
}

export { PasswordDocument };
