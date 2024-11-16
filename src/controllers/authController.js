import { successResponse } from "../utils/responseHelper.js";
import {
  addUser,
  checkUserEmail,
  checkUserName,
  validateUser,
} from "../services/userServices.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import constants from "../utils/config/constants.js";
import { ApiError } from "../utils/errors.js";

const registerUserController = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;
  const uniqueEmailCheck = await checkUserEmail(email);

  if (uniqueEmailCheck) {
    throw new ApiError(409, "Email already exists");
  } else {
    const uniqueUserNameCheck = await checkUserName(userName);
    if (uniqueUserNameCheck) {
      throw new ApiError(409, "Username already exists");
    } else {
      const data = await addUser(email, password, userName);
      return successResponse(res, data, "Registration successful");
    }
  }
});

const loginUserController = asyncHandler(async (req, res) => {
  const { email, password, rfTime } = req.body;
  const data = await validateUser(email, password);
  if (!data) {
    throw new ApiError(401, 'Wrong credentials')
  }
  // console.log(data, "***");
  const accessToken = jwt.sign(
    {
      userId: data._id,
      email: data.email,
      role: data.role,
    },
    constants.jwtSecreteAT,
    { expiresIn: constants.jwtExpiry }
  );
  const rfTimeNum = parseInt(rfTime, 10);
  const refreshToken = rfTimeNum
    ? jwt.sign(
      {
        userId: data._id,
        email: data.email,
        role: data.role,
      },
      constants.jwtSecreteRT,
      { expiresIn: rfTimeNum }
    )
    : "";

  return successResponse(
    res,
    { ...data, accessToken, refreshToken },
    "Login successfully"
  );
});

const rfTokenController = asyncHandler(async (req, res) => {
  const { rfToken } = req.body;
  try {
    const decoded = jwt.verify(rfToken, constants.jwtSecreteRT);
    const { email } = decoded;
    if (email) {
      const userData = await checkUserEmail(email);
      if (userData) {
        const accessToken = jwt.sign(
          {
            userId: userData._id,
            email: userData.email,
            role: userData.role,
          },
          constants.jwtSecreteAT,
          { expiresIn: constants.jwtExpiry }
        );
        return successResponse(res, { accessToken }, "Accesstoken renewed");
      } else {
        throw new ApiError(401, "User not found");
      }
    } else {
      throw new ApiError(401, "User not found");
    }
  } catch (error) {
    throw new ApiError(401, "Unauthorized Request", error);
  }
});

export { registerUserController, loginUserController, rfTokenController };
