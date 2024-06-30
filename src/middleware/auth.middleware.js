import { ApiError } from "../utils/ApiError.js";
import { asyncHandlerExpress } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { getUser } from "../services/auth/user.services.js";

export const verifyJWT = asyncHandlerExpress(
    async (req, res, next) => {
        const token = req.cookies?.accessToken;
        if (!token) {
            throw new ApiError(401, 'Unauthorized Access');
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken, '***d')
        const user = await getUser({ id: decodedToken._id });
        console.log(user, '***')
        if (!user) {
            throw new ApiError(401, 'Invalid access token');
        }
        req.user = user;
        next();
    }

)