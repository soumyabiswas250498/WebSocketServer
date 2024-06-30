import { asyncHandlerExpress } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createUser, checkExistingUser, updateByEmail, getUser, passwordCheck, generateAccessRefreshToken } from "../services/auth/user.services.js";
import { ApiError } from "../utils/ApiError.js";
import { emailOtpTokenGen, emailOtpTokenVerify } from "../utils/OtpToken.js";


const registerUser = asyncHandlerExpress(
    async (req, res) => {
        const { userName, email, password } = req.body;
        const existingUserName = await checkExistingUser({ userName })
        const existingUserEmail = await checkExistingUser({ email })
        if (existingUserName?.userName || existingUserEmail?.email) {
            if (existingUserName?.userName && existingUserName?.isVerified) {
                throw new ApiError(
                    409,
                    'Username already exists.'
                );
            }
            if (existingUserEmail?.email && existingUserEmail?.isVerified) {
                throw new ApiError(
                    409,
                    'Email already exists.'
                );
            }
            const otpToken = emailOtpTokenGen();
            const updatedUser = await updateByEmail(email, { userName, password, otpToken });
            res.json(new ApiResponse(200, updatedUser, 'User Registered Successfully'));
        } else {
            const otpToken = emailOtpTokenGen();
            const newUser = await createUser(userName, email, password, otpToken);
            res.json(new ApiResponse(200, newUser, 'User Registered Successfully'));
        }
    }
)

const emailVerify = asyncHandlerExpress(
    async (req, res) => {
        const { email, otp } = req.body;
        const { otpToken, isVerified } = await getUser({ email })
        if (!isVerified) {
            const result = emailOtpTokenVerify({ otpToken, otp })
            if (result.isVerified) {
                const otpToken = '';
                const isVerified = true;
                const updatedUser = await updateByEmail(email, { otpToken, isVerified });
                res.json(new ApiResponse(201, updatedUser, 'User Verified Successfully'));
            } else {
                throw new ApiError(
                    401,
                    result.reason
                );
            }
        } else {
            throw new ApiError(
                409,
                'User Already Verified.'
            );
        }
    }
)

const userLogin = asyncHandlerExpress(
    async (req, res) => {
        const { email, password } = req.body;
        const { accessToken, refreshToken, userName } = await passwordCheck(email, password);
        const options = {
            httpOnly: true,
            secure: true,
        };
        res.cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options).json(new ApiResponse(201, { userName, email }, 'User Logged In Successfully'));
    }
)

const userProfile = asyncHandlerExpress(
    async (req, res) => {
        res.json(new ApiResponse(201, 'updatedUser', 'User Successfully'));
    }
)




export { registerUser, emailVerify, userLogin, userProfile }