import { successResponse } from "../utils/responseHelper.js";
import {
  addUser,
  checkUserEmail,
  checkUserName,
  validateUser
} from "../services/userServices.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import constants from "../utils/config/constants.js";

const registerUserController = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;
  const uniqueEmailCheck = await checkUserEmail(email);

  if (uniqueEmailCheck) {
    throw new Error("Email already exists");
  } else {
    const uniqueUserNameCheck = await checkUserName(userName);
    if (uniqueUserNameCheck) {
      throw new Error("Username already exists");
    } else {
      const data = await addUser(email, password, userName);
      return successResponse(res, data, "Registration successful");
    }
  }
});

const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await validateUser(email, password);
  // console.log(data, '***t3')
  const token = jwt.sign(
    {
      userId: data._id,
      email: data.email
    },
    constants.jwtSecrete,
    { expiresIn: constants.jwtExpiry }
  );

  return successResponse(res, { ...data, token }, "Login successfully");
})

export { registerUserController, loginUserController };
