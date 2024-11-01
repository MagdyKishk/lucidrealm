import { Response } from 'express'
import { AuthedRequest } from '@b/types/auth.types'
import { Email } from '@b/models';
import Logger from '@b/utils/logger';

export default async (req: AuthedRequest, res: Response) => {
    const { verificationCode } = req.body;
    const currentUser = req.user

    Logger.info(`Processing email verification for user: ${currentUser._id}`);

    if (!verificationCode) {
        res.status(422).json({
            success: false,
            message: "Please provide a verification code",
        });
        return;
    }

    try {
        const targetEmail = await Email.findOne({
            verifyCode: verificationCode,
            _id: { $in: currentUser.emails },
            verifyExpire: { $gt: Date.now() }
        });

        if (!targetEmail) {
            Logger.warn(`Verification failed: Invalid or expired code for user ${currentUser._id}`);
            res.status(404).json({
                success: false,
                message: "Invalid or expired verification code",
            });
            return;
        }

        targetEmail.isValid = true;
        targetEmail.verifyCode = undefined;
        targetEmail.verifyExpire = undefined;

        await targetEmail.save()

        Logger.info(`Email successfully verified for user: ${currentUser._id}`);
        res.status(200).json({
            success: true,
            message: "Email Verified Successfully"
        });
        return;
    } catch (error) {
        Logger.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to verify email address",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}
