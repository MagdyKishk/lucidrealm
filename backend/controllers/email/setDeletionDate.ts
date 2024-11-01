import { Response } from 'express';
import { AuthedRequest } from '../../types/auth.types';
import { Email } from '../../models';
import Logger from '../../utils/logger';

export default async (req: AuthedRequest, res: Response) => {
    const { emailId } = req.body;
    const currentUser = req.user;

    if (!emailId) {
        res.status(422).json({
            success: false,
            message: "Please provide an email ID",
        });
        return;
    }

    if (currentUser.emails.length === 1) {
        res.status(422).json({
            success: false,
            message: "You must have at least one email",
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
        });
    } catch (error) {
        Logger.error('Set deletion date error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to set deletion date",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}; 