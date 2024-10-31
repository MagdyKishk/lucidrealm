import { Request, Response } from 'express';
import AuthService from '../../services/auth';
import { Email, Password, User } from '../../models';
import bcryptjs from "bcryptjs";
import signUser from '../../services/auth/signUser';

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
            res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        // Fetch the user and validate the existence
        const targetUser = await User.findById(existingEmail.userId);
        if (!targetUser) {
            res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        // Get the user's current password and verify it
        const targetPassword = await Password.findById(targetUser.passwords.current);
        if (!targetPassword) {
            res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        // Vlidate the password
        const isValidPassword = await bcryptjs.compare(password, targetPassword.hash);
        if (!isValidPassword) {
            res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });
            return;
        }

        // Generate JWT token
        const token = signUser(targetUser.toObject())

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
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
