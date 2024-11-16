import express from "express";
import {
  registerUserController,
  loginUserController,
  rfTokenController,
} from "../controllers/authController.js";
import { validateData } from "../middlewares/validator.js";
import { regSchema, loginSchema } from "../schemas/authSchema.js";

const authRouter = express.Router();

authRouter.post("/register", validateData(regSchema), registerUserController);
authRouter.post("/login", validateData(loginSchema), loginUserController);
authRouter.post("/refresh", rfTokenController);

export default authRouter;
