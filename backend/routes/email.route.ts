import express from 'express';
import onlyAuthed from '../middleware/auth/onlyAuthed';
import { emailController } from '../controllers';

const EmailRouter = express.Router()

EmailRouter.post("/verify", onlyAuthed, emailController.verify)
EmailRouter.post("/add", onlyAuthed, emailController.add)

export default EmailRouter;