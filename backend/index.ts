import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { cookieParserConfig } from '@b/config';
import db from '@b/database';
import Logger from '@b/utils/logger';

// Routes
import AuthRouter from '@b/routes/auth.route';
import EmailRouter from '@b/routes/email.route';

// Cron
import '@b/cron';

// Middleware
import { requestLogger } from './middleware/logging';
import DreamRouter from "./routes/dream.route";

// Load .env in process.env
dotenv.config();


// Initiate express
const app = express();

// Global middlewares
app.use(express.json())
app.use(cookieParser(cookieParserConfig.secret)) // Read cookies in req.cookie / secureCookies

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
