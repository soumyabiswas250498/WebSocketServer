import { User } from "../../models/users.model.js";
import bcrypt from 'bcrypt';
import { ApiError } from "../../utils/ApiError.js";
import jwt from 'jsonwebtoken';

const checkExistingUser = async (params) => {
    const { userName, email } = params
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    return {
        userName: userName === user?.userName,
        email: email === user?.email,
        isVerified: !!user?.isVerified,
    }
}

const getUser = async (params) => {
    const { userName, email, id } = params;
    const user = await User.findOne({
        $or: [{ userName }, { email }, { _id: id }]
    })
    return {
        userName: user.userName,
        email: user.email,
        isVerified: user.isVerified,
        otpToken: user.otpToken,
        role: user.role,
        id: user._id,
    }
}


const createUser = async (userName, email, password, otpToken) => {
    const createdObj = await User.create({ userName, email, password, otpToken });
    return { userName: createdObj.userName, email: createdObj.email };
}

const updateByEmail = async (email, params) => {
    const updatedUser = await User.findOneAndUpdate({ email }, params);
    return { email: updatedUser.email, userName: updatedUser.userName };
}


const generateAccessRefreshToken = async (user) => {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
}

const passwordCheck = async (email, password) => {
    const user = await User.findOne({ email });
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user);
    return { accessToken, refreshToken, userName: user.userName };


}




export { createUser, checkExistingUser, updateByEmail, getUser, generateAccessRefreshToken, passwordCheck }

