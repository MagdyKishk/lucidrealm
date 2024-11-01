import dreamService from "@b/services/dream"
import { AuthedRequest } from "@b/types/auth.types"
import Logger from '@b/utils/logger'
import { Response } from "express"

function validate(title: string, description: string, content: string) {
    const errors: string[] = []

    if (!title || title.length < 10) errors.push("Title must be at least 3 characters long")
    if (!description || description.length < 50) errors.push("Description must be at least 3 characters long") 
    if (!content || content.length < 150) errors.push("Content must be at least 3 characters long")

    return errors
}

export default async function createDream(req: AuthedRequest, res: Response) {
    const { title, description, content } = req.body;
    const currentUser = req.user;
    const errors = validate(title, description, content)

    if (errors.length > 0) {
        Logger.warn(`Dream creation validation failed for user: ${currentUser.id}`)
        res.status(400).json({
            success: false,
            message: errors.join(" "),
        })
        return
    }

    try {
        const dream = await dreamService.create(title, description, content, currentUser.id)

        currentUser.dreams.push(dream._id);
        await currentUser.save()

        Logger.info(`New dream created by user: ${currentUser.id}`)
        res.status(201).json({
            success: true,
            message: "Dream created successfully",
            dream
        })
    } catch (error) {
        Logger.error(`Failed to create dream for user ${currentUser.id}: ${error}`)
        res.status(500).json({
            success: false,
            message: "Failed to create dream",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        })
    }
}