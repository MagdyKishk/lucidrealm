import mongoose from 'mongoose';

interface UserDocument extends Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    emails: mongoose.Types.ObjectId[];
    passwords: {
        history: mongoose.Types.ObjectId[];
        current: mongoose.Types.ObjectId;
    };
    createdAt: Date;
    dreams: mongoose.Types.ObjectId[];
}

interface UserModel extends mongoose.Model<UserDocument> { }

export { UserDocument, UserModel };
