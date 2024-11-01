import express from "express"
import { authController } from '../controllers';
import { onlyAuthed } from '../middleware/auth';

const AuthRouter = express.Router()

//@route POST /auth/signup - Signup 
AuthRouter.post("/signup", authController.signup)

//@route POST /auth/login - Login
AuthRouter.post("/login", authController.login)

//@route POST /auth/check - Check if the user is logged in aka if token is valid
AuthRouter.get("/check", authController.check)

//@ts-expect-error - TODO: fix this
//@route POST /auth/reset-password - Reset password
AuthRouter.post("/reset-password", onlyAuthed, authController.resetPassword)

export default AuthRouter;
