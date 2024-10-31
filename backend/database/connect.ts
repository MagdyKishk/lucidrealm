import mongoose from 'mongoose'
import { databaseConfig } from '../config'

export default async () => {
    const username = databaseConfig.username;
    const password = databaseConfig.password;
    const clusterUrl = databaseConfig.clusterUrl;
    const name = databaseConfig.name;

    console.log("Trying to connect to mongoodb ...")

    try {
        await mongoose.connect(`mongodb+srv://${username}:${password}@${clusterUrl}/${name}?retryWrites=true&w=majority&appName=Cluster0`)
        console.log("Connected to mongoodb sccessfuly")
    } catch (e) {
        console.log("Error while trying to connect to mongoodb")
        console.error(e)
    }
}
