import { Request, Response } from 'express';
import bcryptjs from "bcryptjs";
import { Password, User } from '../../models';
import Logger from '../../utils/logger';
import { regexConfig } from '../../config';

const validateRequest = (userId: string, currentPassword: string, newPassword: string) => {
    const errors: string[] = [];

    if (!userId) {
        errors.push("User ID is required.");
    }
    if (!currentPassword) {
        errors.push("Current password is required.");
    }
    if (!newPassword) {
        errors.push("New password is required.");
    }
    if (!regexConfig.password.test(newPassword)) {
        errors.push("New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (., -, +, or %).");
    }
    if (currentPassword === newPassword) {
        errors.push("New password must be different from current password.");
    }

    return errors;
}

export default async (req: Request, res: Response) => {
    const { userId, currentPassword, newPassword } = req.body;
    Logger.info(`Processing password reset request for user: ${userId}`);

    // Validate request
    const errors = validateRequest(userId, currentPassword, newPassword);
    if (errors.length > 0) {
        Logger.warn(`Password reset validation failed for user: ${userId}`);
        res.status(422).json({
            success: false,
            message: errors.join(" "),
        });
        return;
    }

    try {
        // Find user
        const user = await User.findById(userId);
        if (!user) {
            Logger.warn(`Password reset failed: User not found - ${userId}`);
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        // Get current password
        const currentPasswordDoc = await Password.findById(user.passwords.current);
        if (!currentPasswordDoc) {
            Logger.error(`Critical: User ${userId} has no current password`);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
            return;
        }

        // Verify current password
        const isValidPassword = await bcryptjs.compare(currentPassword, currentPasswordDoc.hash);
        if (!isValidPassword) {
            Logger.warn(`Password reset failed: Invalid current password for user ${userId}`);
            res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
            return;
        }

        // Hash new password
        const newPasswordHash = await bcryptjs.hash(newPassword, 10);

        // Create new password document
        const newPasswordDoc = new Password({
            userId: user._id,
            hash: newPasswordHash,
        });
        await newPasswordDoc.save();

        // Update user's password history
        if (user.passwords.history.length >= 3) {
            // Remove oldest password from history
            user.passwords.history.shift();
        }
        user.passwords.history.push(newPasswordDoc._id);
        user.passwords.current = newPasswordDoc._id;
        await user.save();

        Logger.info(`Password reset successful for user: ${userId}`);
        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error: unknown) {
        Logger.error('Password reset error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
} 