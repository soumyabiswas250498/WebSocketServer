import UserModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import DeviceModel from "../models/deviceModel.js";
import constants from "../utils/config/constants.js";
import { ApiError } from "../utils/errors.js";

const addUser = asyncHandler(async (email, password, userName) => {
  const data = await UserModel.create({ email, password, userName });
  return data ? data.toObject() : null;
});

const checkUserEmail = asyncHandler(async (email) => {
  const data = await UserModel.findOne({ email });
  return data;
});

const checkUserName = asyncHandler(async (userName) => {
  const data = await UserModel.findOne({ userName });
  return data ? data.toObject() : null;
});

const getUserById = asyncHandler(async (userId) => {
  const data = await UserModel.findById(userId);
  return data ? data.toObject() : null;
});

const validateUser = asyncHandler(async (email, password) => {
  const user = await checkUserEmail(email, "login");
  if (user) {
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      return {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        role: user.role,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
});

const addDevice = asyncHandler(async (name, usageType, user) => {
  if (user.deviceIds.length >= constants.maxDevice) {
    throw new ApiError(400, `Maximum ${constants.maxDevice} device allowed.`);
  }
  user.deviceIds.forEach((element) => {
    if (element.name === name) {
      throw new ApiError(409, `Device name already exists`);
    }
  });
  const newDevice = await DeviceModel.create({
    name,
    usageType,
    owner: user._id,
  });
  if (newDevice._id) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $push: { deviceIds: newDevice._id } },
      { new: true }
    );
    console.log(newDevice, updatedUser);
  }

  return newDevice;
});

export {
  addUser,
  checkUserEmail,
  checkUserName,
  getUserById,
  validateUser,
  addDevice,
};
