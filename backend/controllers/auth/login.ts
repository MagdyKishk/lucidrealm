import { Request, Response } from 'express';
import { Email, Password, User } from '@b/models';
import bcryptjs from "bcryptjs";
import AuthService from '@b/services/auth';
import Logger from '@b/utils/logger';

// Validation function for chaining
const validateRequest = (email: string, password: string) => {
    const errors: string[] = [];

    if (!email) {
        errors.push("Missing required email data.");
    }
    if (!password) {
        errors.push("Missing required password data.");
    }
    if (!/^[\p{L}\d._%+-]+@[\p{L}\d.-]+\.[\p{L}]{2,}$/u.test(email)) {
        errors.push("Email must be in a valid format (e.g., user@example.com).");
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.\-+%])[A-Za-z\d.\-+%]{8,}$/.test(password)) {
        errors.push("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (., -, +, or %).");
    }

    return errors;
}

export default async (req: Request, res: Response) => {
    const { email, password } = req.body;
    Logger.info(`Processing login attempt for email: ${email}`);

    // Run validations
    const errors = validateRequest(email, password);
    if (errors.length > 0) {
        res.status(422).json({ success: false, message: errors.join(" ") });
        return;
    }

    try {
        // Check if email exists
        const existingEmail = await Email.findOne({ address: email });
        if (!existingEmail) {
            Logger.warn(`Login failed: Email not found - ${email}`);
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
                code: 'INVALID_CREDENTIALS'
            });
            return;
        }

        // Fetch the user and validate the existence
        const targetUser = await User.findById(existingEmail.userId);
        if (!targetUser) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
                code: 'INVALID_CREDENTIALS'
            });
            return;
        }

        // Get the user's current password and verify it
        const targetPassword = await Password.findById(targetUser.passwords.current);
        if (!targetPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
                code: 'INVALID_CREDENTIALS'
            });
            return;
        }

        // Vlidate the password
        const isValidPassword = await bcryptjs.compare(password, targetPassword.hash);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
                code: 'INVALID_CREDENTIALS'
            });
            return;
        }

        // Generate JWT token
        const token = AuthService.signUser(targetUser.toObject())

        // Successful login response
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
