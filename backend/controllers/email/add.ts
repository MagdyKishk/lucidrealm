import { Response } from 'express';
import { AuthedRequest } from '../../types/auth.types';
import { Email } from '../../models';

// Strategy Pattern for Handling Email Addition Logic
export default async (req: AuthedRequest, res: Response): Promise<void> => {
    const { email } = req.body;
    const currentUser = req.user;

    if (!email) {
        res.status(422).json({
            success: false,
            message: "Please provide an email address",
            code: 'MISSING_EMAIL'
        });
        return;
    }

    if (!/^[\p{L}\d._%+-]+@[\p{L}\d.-]+\.[\p{L}]{2,}$/u.test(email)) {
        res.status(422).json({
            success: false,
            message: "Please provide a valid email address (e.g., user@example.com)",
            code: 'INVALID_EMAIL_FORMAT'
        });
        return;
    }

    if (currentUser.emails.length >= 5) {
        res.status(403).json({
            success: false,
            message: "You have reached the maximum limit of 5 email addresses per account",
            code: 'EMAIL_LIMIT_REACHED'
        });
        return;
    }

    try {
        const existingEmail = await Email.findOne({ address: email });
        if (existingEmail) {
            res.status(409).json({
                success: false,
                message: "This email address is already registered",
                code: 'EMAIL_EXISTS'
            });
            return;
        }

        // Create and save the new email
        const newEmail = new Email({
            userId: currentUser._id,
            address: email,
        });

        await newEmail.save();
        currentUser.emails.push(newEmail._id);

        // Persist the updated user emails array
        await currentUser.save();

        res.status(201).json({
            success: true,
            message: "Email address successfully added to your account",
        });
    } catch (error: unknown) {
        console.error('Add email error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: "Failed to add email address",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
};
