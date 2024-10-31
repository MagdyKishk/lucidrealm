import { Request, Response } from 'express';
import AuthService from '../../services/auth';
import { Email } from '../../models';
import signUser from '../../services/auth/signUser';

// Validation function for chaining
const validateSignupRequest = (firstName: string, lastName: string, email: string, password: string) => {
    const errors: string[] = [];

    if (!firstName || !lastName || !email || !password) {
        errors.push("Missing required data: first name, last name, email, and password are all required.");
    } else {
        if (firstName.length < 2 || lastName.length < 2)
            errors.push("First name and last name must be at least 2 characters")
        if (!/^[\p{L}\d._%+-]+@[\p{L}\d.-]+\.[\p{L}]{2,}$/u.test(email))
            errors.push("Email must be in a valid format (e.g., user@example.com).");
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.\-+%])[A-Za-z\d.\-+%]{8,}$/.test(password))
            errors.push("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (., -, +, or %).");
    }
    return errors;
};

export default async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    // Run validations
    const errors = validateSignupRequest(firstName, lastName, email, password);
    if (errors.length > 0) {
        res.status(400).json({ success: false, message: errors.join(" ") });
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

        // Create the new user
        const newUser = await AuthService.signup(firstName, lastName, email, password);

        // Generate JWT token
        const token = signUser(newUser)

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
