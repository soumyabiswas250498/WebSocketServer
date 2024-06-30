import { Router } from "express";
import { registerUser, emailVerify, userLogin, userProfile } from "../controller/users.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', userLogin);
userRouter.post('/otp-verify', emailVerify);
userRouter.get('/profile', verifyJWT, userProfile)


export default userRouter;