import express from 'express';
import onlyAuthed from '@b/middleware/auth/onlyAuthed';
import { emailController } from '@b/controllers';

const EmailRouter = express.Router();

EmailRouter.post("/verify", onlyAuthed, emailController.verify);
EmailRouter.post("/add", onlyAuthed, emailController.add);
EmailRouter.post("/set-deletion-date", onlyAuthed, emailController.setDeletionDate);

export default EmailRouter;
