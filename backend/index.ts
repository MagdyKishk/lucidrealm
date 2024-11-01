import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { cookieParserConfig } from './config';
import db from './database';

// Routes
import AuthRouter from './routes/auth.route';
import EmailRouter from './routes/email.route';

// Load .env in process.env
dotenv.config();

// Initiate express
const app = express();

// Global middlewares
app.use(express.json())
app.use(cookieParser(cookieParserConfig.secret)) // Read cookies in req.cookie / secureCookies

app.use("/api/auth", AuthRouter)
app.use("/api/email", EmailRouter)

// Database
db.connect();

// Listening
const SERVER_PORT = process.env.SERVER_PORT
app.listen(SERVER_PORT, () => {
  console.log(`Listening on port: ${SERVER_PORT}`)
})
