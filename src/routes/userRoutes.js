import { userAuthMiddleware } from "../middlewares/userAuthMiddleware.js";
import express from "express";
import { addDeviceController } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/device/add", userAuthMiddleware, addDeviceController);

export default userRouter;
