import { Response } from "express"
import { AuthedRequest } from '../../types/auth.types'
import { Email } from '../../models';
import generateRandomToken from '../../utils/generateRandomToken';
import Logger from '../../utils/logger';
import { regexConfig } from '../../config';

export default async (req: AuthedRequest, res: Response) => {
    const currentUser = req.user;
    const { email } = req.body;
    Logger.info(`Processing verification code send request for: ${email}`);

    if (!email) {
        res.status(422).json({
            success: false,
            message: "Please provide an email address",
        });
        return;
    }

    if (!regexConfig.email.test(email)) {
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
            });
            return;
        }

        if (targetEmail.isValid) {
            res.status(409).json({
                success: false,
                message: "This email address is already verified",
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
    } catch (error) {
        Logger.error('Send verification code error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to send verification code",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}
