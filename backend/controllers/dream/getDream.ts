import Dream from '../../models/dream.mode';
import { AuthedRequest } from '../../types/auth.types';
import Logger from '../../utils/logger';
import { Response } from "express";
import mongoose from "mongoose";

export default async function getDream(req: AuthedRequest, res: Response) {
    const { dreamId } = req.params;
    const currentUser = req.user;

    try {
        // Validate dream ID
        if (!dreamId || !mongoose.Types.ObjectId.isValid(dreamId)) {
            Logger.warn(`Dream retrieval validation failed for user: ${currentUser.id} - Dream ID: ${dreamId} - Dream ID is not valid`)
            res.status(400).json({
                success: false,
                message: "Dream ID is required",
            })
            return;
        }

        // Find dream and check if it exists
        const dream = await Dream.findById(dreamId);
        if (!dream) {
            Logger.warn(`Dream retrieval failed for user: ${currentUser.id} - Dream ID: ${dreamId} - Dream not found`)
            res.status(404).json({
                success: false,
                message: "Dream not found",
            })
            return;
        }

        // Send success response
        Logger.info(`Dream retrieved successfully for user: ${currentUser.id} - Dream ID: ${dreamId}`)
        res.status(200).json({ 
            success: true, 
            message: "Dream retrieved successfully",
            dream
        });
    } catch (error) {
        Logger.error(`Dream retrieval failed for user: ${currentUser.id} - Dream ID: ${dreamId} - Error: ${error}`)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        })
    }
}
