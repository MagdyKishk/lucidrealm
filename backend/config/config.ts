import dotenv from "dotenv"

// Load enviroment variables in process.env
dotenv.config()

export default {
    // Database
    DB_NAME: process.env.DB_NAME || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_USERNAME: process.env.DB_USERNAME || "",
    DB_CLUSTER_URL: process.env.DB_CLUSTER_URL || "",

    // Cookie Parser
    COOKIE_SECRET: process.env.COOKIES_SECRET || "",

    // JWT
    JWT_ACESS_SECRET: process.env.JWT_ACESS_SECRET || "",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
}
