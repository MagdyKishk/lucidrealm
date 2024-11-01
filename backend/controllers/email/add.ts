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
            message: "Missing required data: email.",
        });
        return;
    }

    if (!/^[\p{L}\d._%+-]+@[\p{L}\d.-]+\.[\p{L}]{2,}$/u.test(email)) {
        res.status(422).json({
            success: false,
            message: "Email must be in a valid format (e.g., user@example.com).",
        });
        return;
    }

    if (currentUser.emails.length >= 5) {
        res.status(403).json({
            success: false,
            message: "You cannot have more than 5 emails attached to your account.",
        });
        return;
    }

    try {
        // Check if the email already exists
        const existingEmail = await Email.findOne({ address: email });
        if (existingEmail) {
            res.status(409).json({
                success: false,
                message: "Email already exists.",
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
            message: "Email successfully added to your account.",
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: "Invalid data provided.",
                error: error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }
};
