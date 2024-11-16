import { ApiError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import constants from "../utils/config/constants.js";
import { getUserById } from "../services/userServices.js";
import asyncHandler from "express-async-handler";

export const userAuthMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new ApiError(401, "Unauthorized request");
  } else {
    const userData = await jwtAuth(authHeader);
    if (userData) {
      req.user = {
        ...userData,
      };
      next();
      return;
    }
    throw new ApiError(401, "Unauthorized request");
  }
});

export const jwtAuth = async (token) => {
  try {
    const tokenData = jwt.verify(token, constants.jwtSecreteAT);
    const userData = await getUserById(tokenData.userId);
    delete userData.password;
    if (userData.email === tokenData.email) {
      return { ...userData };
    }
    return null;
  } catch (error) {
    console.log(error, '***');
    return null;
  }
}
