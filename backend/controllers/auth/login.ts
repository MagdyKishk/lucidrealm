import { Request, Response } from 'express';
import { Email, Password, User } from '../../models';
import bcryptjs from "bcryptjs";
import { regexConfig } from '../../config';
import Logger from '../../utils/logger';
import AuthService from '../../services/auth';

// Validation function for chaining
const validateRequest = (email: string, password: string) => {
    const errors: string[] = [];

    if (!email) {
        errors.push("Missing required email data.");
    }
    if (!password) {
        errors.push("Missing required password data.");
    }
    if (!regexConfig.email.test(email)) {
        errors.push("Email must be in a valid format (e.g., user@example.com).");
    }
    if (!regexConfig.password.test(password)) {
        errors.push("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (., -, +, or %).");
    }

    return errors;
}

export default async (req: Request, res: Response) => {
    const { email, password } = req.body;
    Logger.user(`Login attempt for email: ${email}`);

    // Run validations
    const errors = validateRequest(email, password);
    if (errors.length > 0) {
        Logger.warn(`Login validation failed for email: ${email}`);
        res.status(422).json({
            success: false,
            message: errors.join(" "),
        });
        return;
    }

    try {
        // Check if email exists and get associated user
        const existingEmail = await Email.findOne({ address: email });
        if (!existingEmail) {
            Logger.warn(`Login failed: Email not found - ${email}`);
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        // Fetch the user and validate existence
        const targetUser = await User.findById(existingEmail.userId);
        if (!targetUser) {
            Logger.warn(`Login failed: User not found for email - ${email}`);
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        // Get current password
        const currentPassword = await Password.findById(targetUser.passwords.current);
        if (!currentPassword) {
            Logger.error(`Critical: User ${targetUser._id} has no current password`);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
            return;
        }

        // First check if the provided password matches current password
        const isCurrentPassword = await bcryptjs.compare(password, currentPassword.hash);
        if (isCurrentPassword) {
            // Generate JWT token and send success response
            const token = AuthService.signUser(targetUser.toObject());

            // Set cookie
            AuthService.setCookie(res, token);
            
            res.status(200).json({
                success: true,
                message: "User logged in successfully.",
                user: {
                    ...targetUser.toObject(),
                    passwords: undefined,
                    emails: undefined
                },
                token
            });

            Logger.info(`User successfully logged in: ${email}`);
            return;
        }

        // If current password didn't match, check password history
        const passwordHistory = await Password.find({ 
            _id: { $in: targetUser.passwords.history }
        });

        // Check if password matches any historical password
        for (const historyPassword of passwordHistory) {
            const isOldPassword = await bcryptjs.compare(password, historyPassword.hash);
            if (isOldPassword) {
                Logger.warn(`Login failed: User attempted to use old password - ${email}`);
                res.status(401).json({
                    success: false,
                    message: `This password was changed on ${currentPassword.createdAt.toLocaleDateString()}. Please use your current password.`,
                });
                return;
            }
        }

        // If we get here, password doesn't match current or historical passwords
        Logger.warn(`Login failed: Invalid password for email - ${email}`);
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });

    } catch (error: unknown) {
        Logger.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: "Failed to process login request",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
};
