import mongoose from 'mongoose'
import { databaseConfig } from '@b/config'
import Logger from '@b/utils/logger'

export default async () => {
    const { username, password, clusterUrl, name } = databaseConfig;

    Logger.info("Trying to connect to MongoDB...")

    try {
        const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${name}?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(uri)
        Logger.info("Connected to MongoDB successfully")
    } catch (e) {
        Logger.error("Error while trying to connect to MongoDB:", e)
        process.exit(1)  // Exit if database connection fails
    }
}
