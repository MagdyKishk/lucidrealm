import { Request, Response } from 'express';
import AuthService from '../../services/auth';
import { Email } from '../../models';
import Logger from '../../utils/logger';
import { regexConfig } from '../../config';

// Validation function for chaining
const validateSignupRequest = (firstName: string, lastName: string, email: string, password: string) => {
    const errors: string[] = [];

    if (!firstName || !lastName || !email || !password) {
        errors.push("Please provide all required fields: first name, last name, email, and password.");
    } else {
        if (firstName.length < 2 || lastName.length < 2)
            errors.push("First name and last name must be at least 2 characters long.");
        if (!regexConfig.email.test(email))
            errors.push("Please provide a valid email address (e.g., user@example.com).");
        if (!regexConfig.password.test(password))
            errors.push("Password must be at least 8 characters long and include: one lowercase letter, one uppercase letter, one number, and one special character (., -, +, or %).");
    }
    return errors;
};

export default async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    Logger.user(`New signup request for: ${email}`);

    // Run validations
    const errors = validateSignupRequest(firstName, lastName, email, password);
    if (errors.length > 0) {
        Logger.warn(`Signup validation failed for email: ${email}`);
        res.status(422).json({
            success: false,
            message: "Validation failed",
            errors: errors
        });
        return;
    }

    try {
        // Check if the email already exists
        const existingEmail = await Email.findOne({ address: email });
        if (existingEmail) {
            Logger.warn(`Signup failed: Email already exists - ${email}`);
            res.status(409).json({
                success: false,
                message: "An account with this email address already exists.",
            });
            return;
        }

        // Create the new user
        const newUser = await AuthService.signup(firstName, lastName, email, password);

        // Generate JWT token
        const token = AuthService.signUser(newUser)

        // Set cookie
        AuthService.setCookie(res, token);

        // Successful signup response
        res.status(201).json({
            success: true,
            message: "User signed up successfully.",
            user: {
                ...newUser,
                passwords: undefined,
                emails: undefined
            },
            token
        });
    } catch (error: unknown) {
        Logger.error('Signup error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: "Failed to create user account",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
};
