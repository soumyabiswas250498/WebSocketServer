import asyncHandler from "express-async-handler";
import DeviceModel from "../models/deviceModel.js";


const saveOfflineMessage = asyncHandler(async (toDeviceId, msg, fromDeviceId) => {
    const data = await DeviceModel.findById(toDeviceId)
    if (!data) {
        console.error(`Device with ID ${toDeviceId} not found.`);
        return;
    }
    data.messages.push({ msg, fromDeviceId })
    await data.save();
    return data;
})

const removeOfflineMessage = asyncHandler(async (deviceId) => {
    const data = await DeviceModel.findById(deviceId)
    if (!data) {
        console.error(`Device with ID ${deviceId} not found.`);
        return;
    }
    data.messages = [];
    await data.save();
    return data;
})

export { saveOfflineMessage, removeOfflineMessage }