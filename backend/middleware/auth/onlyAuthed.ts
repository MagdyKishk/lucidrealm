import { AuthedRequest } from '../../types/auth.types'
import { Response, NextFunction } from 'express'
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from '../../models'

export default async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(403).json({
        success: false,
        message: "Unaothorized: Missing auth token"
        })
        return
    }

    try {
        const decoded = jwt.decode(token) as JwtPayload;
        if (decoded == null) {
        res.status(403).json({
            success: false,
            message: "Unaothorized: Invalid or expired token"
        })
        return
        }
        const targetUser = await User.findById(decoded.id)
        if (!targetUser) {
        res.status(403).json({
            success: false,
            message: "Unaothorized: Invalid or expired token"
        })
        return
        }

        req.user = targetUser.toObject();
        next()
    } catch (error: any) {
        res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
        })
    }
}
