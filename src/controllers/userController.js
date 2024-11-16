import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/responseHelper.js";
import { addDevice } from "../services/userServices.js";

const addDeviceController = asyncHandler(async (req, res) => {
  console.log(req.user, "***");
  const { name, usageType } = req.body;
  const newDevice = await addDevice(name, usageType, req.user);
  return successResponse(res, newDevice, "Registration successful");
});

export { addDeviceController };
