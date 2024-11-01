import Dream from "@b/models/dream.mode";
import { AuthedRequest } from "@b/types/auth.types";
import Logger from "@b/utils/logger";
import { Response } from "express";

export default async function getAllByUser(req: AuthedRequest, res: Response) {
    const { userId } = req.params;

    try {
        // Find all dreams by user
        const dreams = await Dream.find({ userId: userId });

        // Send success response
        Logger.info(`Dreams retrieved successfully for user: ${userId}`)
        res.status(200).json({ 
            success: true, 
            dreams 
        });

    } catch (error) {
        Logger.error(`Error retrieving dreams for user: ${userId} - Error: ${error}`)
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });

    }
}