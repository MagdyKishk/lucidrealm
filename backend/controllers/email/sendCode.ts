import { Response } from "express"
import { AuthedRequest } from '@b/types/auth.types'
import { Email } from '@b/models';
import generateRandomToken from '@b/utils/generateRandomToken';
import Logger from '@b/utils/logger';

export default async (req: AuthedRequest, res: Response) => {
    const currentUser = req.user;
    const { email } = req.body;
    Logger.info(`Processing verification code send request for: ${email}`);

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
            message: "Email must be in a valid format (e.g., user@example.com).",
        });
        return;
    }

    try {
        const targetEmail = await Email.findOne({
            userId: currentUser._id,
            address: email
        });

        if (!targetEmail) {
            res.status(404).json({
                success: false,
                message: "Email address not found in your account",
                code: 'EMAIL_NOT_FOUND'
            });
            return;
        }

        if (targetEmail.isValid) {
            res.status(409).json({
                success: false,
                message: "This email address is already verified",
                code: 'EMAIL_ALREADY_VERIFIED'
            });
            return;
        }

        targetEmail.verifyCode = generateRandomToken();
        targetEmail.verifyExpire = new Date(Date.now() + (1000 * 60 * 60 * 24));

        await targetEmail.save();

        res.status(200).json({
            success: true,
            message: "A new verification code has been created and sent"
        });

        Logger.info(`Verification code sent to: ${email}`);
    } catch (error: unknown) {
        Logger.error('Send verification code error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: "Failed to send verification code",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
}
