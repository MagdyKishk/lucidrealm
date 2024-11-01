import Dream from "@b/models/dream.mode";

export default async function create(title: string, description: string, content: string, userId: string) {
    const dream = new Dream({
        title,
        description,
        content,
        userId: userId
    })
    
    await dream.save()
    return dream;
}