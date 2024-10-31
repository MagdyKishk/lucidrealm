import jwt, { JwtPayload } from "jsonwebtoken"
import { Response, Request } from 'express'
import { User } from '../../models'

export default async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) { // Check
        res.status(403).json({
            success: false,
            message: "Unaothorized: Missing auth token"
        })
        return
    }

    try {
        // Decode JWT token
        const decoded = jwt.decode(token) as JwtPayload
        if (decoded == null) { // Check if Token is valid
            res.status(403).json({
                success: false,
                message: "Unaothorized: Invalid or expired token"
            })
            return
        }

        // Check if user exist
        const targetUser = await User.findById(decoded.id)
        if (!targetUser) {
            res.status(403).json({
                success: false,
                message: "Unaothorized: Invalid or expired token"
            })
            return
        }

        // Return Response
        res.status(200).json({
            success: true,
            message: "User is Authanticated",
            user: {
                ...targetUser.toObject(),
                passwords: undefined,
                emails: undefined
            }
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }

}
