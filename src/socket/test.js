import { jwtAuth } from "../middlewares/userAuthMiddleware.js";
import { saveOfflineMessage, removeOfflineMessage } from "../services/deviceServices.js";

const handleSocketConnection = (io) => {
  const deviceSocketMap = {}; // { deviceId: socketId }
  const userDeviceMap = {}; // { userId: [deviceId1, deviceId2] }

  io.use(async (socket, next) => {
    try {
      const { deviceid, authorization } = socket.handshake.headers;
      const userData = await jwtAuth(authorization);
      const userId = userData._id.toString();

      let offlineMsg = null;
      const deviceIds = userData.deviceIds.map((item) => {
        const deviceIdCurrent = item._id.toString();
        if (deviceIdCurrent === deviceid) offlineMsg = item.messages;
        return deviceIdCurrent;
      });

      if (!deviceIds.includes(deviceid)) {
        return next(new Error("Unauthorized Access"));
      }

      deviceSocketMap[deviceid] = socket.id;
      userDeviceMap[userId] = deviceIds;

      socket.deviceId = deviceid;
      socket.userId = userId;
      socket.offlineMsg = offlineMsg;

      next();
    } catch (error) {
      console.error("Socket Auth Error:", error.message);
      return next(new Error("Unauthorized Access"));
    }
  });

  io.on("connection", (socket) => {
    const { deviceId, userId, offlineMsg } = socket;

    if (offlineMsg?.length) {
      io.to(socket.id).emit("offlineMsg", offlineMsg);
      removeOfflineMessage(deviceId);
    }

    socket.on("c2s_message", async ({ toDeviceId, message }) => {
      console.log(userDeviceMap, '***')
      if (!userDeviceMap[userId]?.includes(toDeviceId)) {
        console.warn("Unauthorized message attempt");
        socket.emit("error", "Unauthorized Access");
        return;
      }

      const targetSocketId = deviceSocketMap[toDeviceId];
      if (targetSocketId) {
        io.to(targetSocketId).emit("s2c_message", { from: deviceId, message });
      } else {
        console.log(`Device ${toDeviceId} is offline. Storing message.`);
        saveOfflineMessage(toDeviceId, message, deviceId);
      }
    });

    socket.on("disconnect", () => {

      delete deviceSocketMap[deviceId];
      console.log(deviceSocketMap, '***')

    });
  });
};

export { handleSocketConnection };
