import jwt, { JwtPayload } from "jsonwebtoken"
import { Response, Request } from 'express'
import { User } from '@b/models'
import Logger from '@b/utils/logger';

export default async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Authentication required. Please provide a valid token"
        })
        return
    }

    try {
        Logger.info(`Processing auth check for token: ${token.substring(0, 10)}...`);
        const decoded = jwt.decode(token) as JwtPayload
        if (decoded == null) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            })
            Logger.error(`Invalid authentication token for token: ${token.substring(0, 10)}...`)
            return
        }

        const targetUser = await User.findById(decoded.id)
        if (!targetUser) {
            res.status(404).json({
                success: false,
                message: "User account not found"
            })
            Logger.error(`User account not found for token: ${token.substring(0, 10)}...`)
            return
        }

        res.status(200).json({
            success: true,
            message: "User is Authanticated",
            user: {
                ...targetUser.toObject(),
                passwords: undefined,
                emails: undefined
            }
        })
        Logger.info(`User is authenticated for token: ${token.substring(0, 10)}...`)

    } catch (error: unknown) {
        Logger.error('Auth check error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            success: false,
            message: "Failed to process authentication request",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }

}
