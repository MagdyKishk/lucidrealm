import { Response } from 'express'
import { AuthedRequest } from '../../types/auth.types'
import { Email } from '../../models';

export default async (req: AuthedRequest, res: Response) => {
    const { verificationCode } = req.body;
    const currentUser = req.user

    if (!verificationCode) {
        res.status(422).json({
            success: false,
            message: "Missing required data verification code"
        })
        return;
    }

    try {
        const targetEmail = await Email.findOne({
            verifyCode: verificationCode,
            _id: { $in: currentUser.emails },
            verifyExpire: { $gt: Date.now() }
        });

        if (!targetEmail) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
            return;
        }

        targetEmail.isValid = true;
        targetEmail.verifyCode = undefined;
        targetEmail.verifyExpire = undefined;

        await targetEmail.save()

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully"
        })
        return;
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
