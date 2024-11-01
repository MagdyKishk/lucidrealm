import { Response } from 'express';
import { AuthedRequest } from '@b/types/auth.types';
import { Email } from '@b/models';
import Logger from '@b/utils/logger';

export default async (req: AuthedRequest, res: Response) => {
    const { emailId } = req.body;
    const currentUser = req.user;

    if (!emailId) {
        res.status(422).json({
            success: false,
            message: "Please provide an email ID",
            code: 'MISSING_EMAIL_ID'
        });
        return;
    }

    if (currentUser.emails.length === 1) {
        res.status(422).json({
            success: false,
            message: "You must have at least one email",
            code: 'MIN_EMAILS'
        });
        return;
    }

    try {
        const targetEmail = await Email.findOne({
            _id: emailId,
            userId: currentUser._id
        });

        if (!targetEmail) {
            res.status(404).json({
                success: false,
                message: "Email not found",
                code: 'EMAIL_NOT_FOUND'
            });
            return;
        }

        // Set deletion date to 24 hours from now
        targetEmail.deletionDate = new Date(Date.now() + (1000 * 60 * 60 * 24));
        await targetEmail.save();

        Logger.info(`Deletion date set for email: ${targetEmail.address}`);
        res.status(200).json({
            success: true,
            message: "Deletion date set successfully",
            deletionDate: targetEmail.deletionDate
        });
    } catch (error: unknown) {
        Logger.error('Set deletion date error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: "Failed to set deletion date",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
}; 