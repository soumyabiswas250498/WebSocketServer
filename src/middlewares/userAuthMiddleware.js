import { ApiError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import constants from "../utils/config/constants.js";
import { getUserById } from "../services/userServices.js";

export const userAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  //   console.log(authHeader, "***");

  if (!authHeader) {
    throw new ApiError(401, "Unauthorized request");
  } else {
    try {
      const tokenData = jwt.verify(authHeader, constants.jwtSecreteAT);

      if (tokenData) {
        const userData = await getUserById(tokenData.userId);
        delete userData.password;
        if (userData.email === tokenData.email) {
          req.user = {
            ...userData,
          };
          next();
          return;
        }
      }
      throw new ApiError(401, "Unauthorized request");
    } catch (error) {
      throw new ApiError(401, "Unauthorized request", error);
    }
  }
};
