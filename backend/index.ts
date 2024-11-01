import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

// Config
import { cookieParserConfig, corsConfig } from './config';

// Database
import db from './database';

// Logger
import Logger from './utils/logger';

// Routes
import AuthRouter from './routes/auth.route';
import EmailRouter from './routes/email.route';

// Cron
import './cron';

// Middleware
import { requestLogger } from './middleware/logging';
import DreamRouter from "./routes/dream.route";

// Cors
import cors from 'cors';

// Load .env in process.env
dotenv.config();


// Initiate express
const app = express();

// Global middlewares
app.use(express.json())
app.use(cookieParser(cookieParserConfig.secret)) // Read cookies in req.cookie / secureCookies
app.use(cors(corsConfig))

// Add this before your routes
app.use(requestLogger);

app.use("/api/auth", AuthRouter)
app.use("/api/email", EmailRouter)
app.use("/api/dream", DreamRouter)

// Database
db.connect();

// Listening
const SERVER_PORT = process.env.SERVER_PORT
app.listen(SERVER_PORT, () => {
  Logger.info(`Listening on port: ${SERVER_PORT}`)
})
