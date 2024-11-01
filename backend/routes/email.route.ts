import express from 'express';
import { onlyAuthed } from '@b/middleware/auth';
import { emailController } from '@b/controllers';

const EmailRouter = express.Router();

//@ts-expect-error onlyAuthed
//@route POST /email/verify - Verify an email
EmailRouter.post("/verify", onlyAuthed, emailController.verify);

//@ts-expect-error onlyAuthed
//@route POST /email/add - Add an email
EmailRouter.post("/add", onlyAuthed, emailController.add);

//@ts-expect-error onlyAuthed
//@route POST /email/set-deletion-date - Set a deletion date for an email
EmailRouter.post("/set-deletion-date", onlyAuthed, emailController.setDeletionDate);

export default EmailRouter;