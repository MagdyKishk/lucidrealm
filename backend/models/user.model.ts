import mongoose, { Schema } from 'mongoose';
import { Password, Email } from '.';
import { userTypes } from '../types';
import Dream from './dream.mode';


const userSchema = new Schema<userTypes.UserDocument>({
    firstName: {
        type: String,
        required: true,
        match: /.{2,}/,
    },
    lastName: {
        type: String,
        required: true,
        match: /.{2,}/,
    },
    emails: {
        type: [Schema.Types.ObjectId],
        ref: "Email",
        required: true,
        max: 5,
    },
    dreams: {
        type: [Schema.Types.ObjectId],
        ref: "Dream",
        required: true,
    },
    passwords: {
        type: {
            history: {
                type: [Schema.Types.ObjectId],
                ref: "Password",
                required: true,
                max: 3,
            },
            current: {
                type: Schema.Types.ObjectId,
                ref: "Password",
                required: true,
            },
        },
        required: true,
    },
}, {
    timestamps: true,
});

// Events
userSchema.post<userTypes.UserDocument>("findOneAndDelete", async function (doc: userTypes.UserDocument) {
    if (!doc) return; // Check if the document exists

    const emails = doc.emails;
    const passwords = doc.passwords.history;
    const dreams = doc.dreams;

    // Delete emails
    const emailDeletion = Email.deleteMany({ _id: { $in: emails } });

    // Delete passwords
    const passwordDeletion = Password.deleteMany({ _id: { $in: passwords } });

    // Delete dreams
    const dreamDeletion = Dream.deleteMany({ _id: { $in: dreams } });

    // Awaiting Both Operations
    await Promise.all([emailDeletion, passwordDeletion, dreamDeletion]);
});

const User = mongoose.model<userTypes.UserDocument, userTypes.UserModel>('User', userSchema);

export default User;
export { userSchema };
