import express from "express"
import { dreamController } from '../controllers';
import { onlyAuthed } from '../middleware/auth';

const DreamRouter = express.Router()

// @ts-expect-error - TODO: Fix onlyAuthed
//@route POST /dream/create - Create a dream
DreamRouter.post("/create", onlyAuthed, dreamController.createDream);

// @ts-expect-error - TODO: Fix onlyAuthed
// @route POST /dream/delete - Delete a dream
DreamRouter.post("/delete", onlyAuthed, dreamController.deleteDream);

// @route POST /dream/update/:dreamId - Update a dream
// DreamRouter.post("/update/:dreamId", onlyAuthed, dreamController.update);

// @ts-expect-error - TODO: Fix onlyAuthed
// @route POST /dream/get/:dreamId - Get a dream
DreamRouter.post("/get/:dreamId", onlyAuthed, dreamController.getDream);

// @ts-expect-error - TODO: Fix onlyAuthed
// @route POST /dream/get-all-by-user/:userId - Get all dreams by user
DreamRouter.post("/get-all-by-user/:userId", onlyAuthed, dreamController.getAllByUser);

export default DreamRouter;