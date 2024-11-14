import express from "express";
import { registerUserController, loginUserController } from "../controllers/authController.js";
import { validateData } from "../middlewares/validator.js";
import { regSchema, loginSchema } from "../schemas/authSchema.js";

const authRouter = express.Router();

authRouter.post("/register", validateData(regSchema), registerUserController);
authRouter.post("/login", validateData(loginSchema), loginUserController)

// authRouter.post("/register1", (req, res, next) => {
//   try {
//     // Some code that might throw an error
//     throw new Error("Example error");
//   } catch (error) {
//     // Pass the error to Express error handler middleware
//     next(error);
//   }
// });

export default authRouter;
