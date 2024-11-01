import express from "express"
import { dreamController } from '../controllers';
import { onlyAuthed } from "@b/middleware/auth";

const DreamRouter = express.Router()

// @ts-expect-error - TODO: Fix onlyAuthed
//@route POST /dream/create - Create a dream
DreamRouter.post("/create", onlyAuthed, dreamController.create);

//@route POST /dream/delete - Delete a dream
// DreamRouter.post("/delete", onlyAuthed, dreamController.delete);

//@route POST /dream/update - Update a dream
// DreamRouter.post("/update", onlyAuthed, dreamController.update);

//@route POST /dream/get - Get a dream
// DreamRouter.post("/get", onlyAuthed, dreamController.get);

//@route POST /dream/get-all - Get all dreams
// DreamRouter.post("/get-all", onlyAuthed, dreamController.getAll);

//@route POST /dream/get-all-by-user - Get all dreams by user
// DreamRouter.post("/get-all-by-user", onlyAuthed, dreamController.getAllByUser);

export default DreamRouter;