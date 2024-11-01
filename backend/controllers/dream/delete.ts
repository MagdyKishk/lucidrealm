import Dream from "@b/models/dream.mode";
import { AuthedRequest } from "@b/types/auth.types";
import Logger from "@b/utils/logger";
import { Response } from "express";
import mongoose from "mongoose";

async function deleteDream(req: AuthedRequest, res: Response) {
    const { dreamId } = req.body;
    const currentUser = req.user;

    // Validate dream ID
    if (!dreamId || !mongoose.Types.ObjectId.isValid(dreamId)) {
        Logger.warn(`Dream deletion validation failed for user: ${currentUser.id} - Dream ID: ${dreamId} - Dream ID is not valid`)
        res.status(400).json({
            success: false,
            message: "Dream ID is required",
        })
        return
    }

    try {
        // Find dream and check if it exists
        const dream = await Dream.findById(dreamId);
        if (!dream) {
            Logger.warn(`Dream deletion failed for user: ${currentUser.id} - Dream ID: ${dreamId} - Dream not found`)
            res.status(404).json({
                success: false,
                message: "Dream not found",
            });
            return
        }

        // Check if dream belongs to user
        if (dream.userId.toString() !== currentUser.id) {
            Logger.warn(`Dream deletion failed for user: ${currentUser.id} - Dream ID: ${dreamId} - Dream does not belong to user`)
            res.status(403).json({
                success: false,
                message: "Dream does not belong to user",
            })
            return
        }

        // Delete dream 
        await Dream.deleteOne({ _id: dreamId })

        Logger.info(`Dream deleted successfully for user: ${currentUser.id} - Dream ID: ${dreamId}`)
        res.status(200).json({
            success: true,
            message: "Dream deleted successfully",
        })
    } catch (error) {
        Logger.error(`Dream deletion failed for user: ${currentUser.id} - Dream ID: ${dreamId} - Error: ${error}`)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        })
    }
}

export default deleteDream;