import express from "express"
import { authController } from '../controllers';

const AuthRouter = express.Router()

//@route POST /auth/signup - Signup 
AuthRouter.post("/signup", authController.signup)

//@route POST /auth/login - Login
AuthRouter.post("/login", authController.login)

//@route POST /auth/check - Check if the user is logged in aka if token is valid
AuthRouter.post("/check", authController.check)

export default AuthRouter;
