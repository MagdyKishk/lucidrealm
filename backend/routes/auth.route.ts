import express from "express"
import { authController } from '../controllers';

const AuthRouter = express.Router()

AuthRouter.post("/signup", authController.signup)
AuthRouter.post("/login", authController.login)
AuthRouter.post("/check", authController.check)

export default AuthRouter;
