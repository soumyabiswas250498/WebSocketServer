import UserModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const addUser = asyncHandler(async (email, password, userName) => {
  const data = await UserModel.create({ email, password, userName });
  return data;
});

const checkUserEmail = asyncHandler(async (email) => {
  const data = await UserModel.findOne({ email });
  return data;
});

const checkUserName = asyncHandler(async (userName) => {
  const data = await UserModel.findOne({ userName });
  return data;
});

const validateUser = asyncHandler(async (email, password) => {
  const user = await checkUserEmail(email);
  if (user) {
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      return { _id: user._id, email: user.email, userName: user.userName };
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export { addUser, checkUserEmail, checkUserName, validateUser };
