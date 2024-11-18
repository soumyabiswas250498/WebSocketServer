import { jwtAuth } from "../middlewares/userAuthMiddleware.js";
import { saveOfflineMessage, removeOfflineMessage } from "../services/deviceServices.js";

const handleSocketConnection = (io) => {
  const deviceSocketMap = {};
  const userDeviceMap = {};

  io.use(async (socket, next) => {
    try {
      const { deviceid, authorization } = socket.handshake.headers;
      const userData = await jwtAuth(authorization)
      const userId = userData._id.toString();
      let offlineMsg = null
      const deviceIds = userData.deviceIds.map((item) => {
        const deviceIdCurrent = item._id.toString();
        if (deviceIdCurrent === deviceid) {
          offlineMsg = item.messages
        }
        return deviceIdCurrent
      });
      const isValidDevice = userId && deviceIds.includes(deviceid);

      if (isValidDevice) {
        deviceSocketMap[deviceid] = socket.id;
        userDeviceMap[userId] = deviceIds;
        // console.log(deviceSocketMap, userDeviceMap, '***');
        socket.deviceId = deviceid;
        socket.userId = userId;
        socket.offlineMsg = offlineMsg;

        next();
      } else {
        return next(new Error("Unauthorized Access"));
      }
    } catch (error) {
      console.log(error)
      return next(new Error("Unauthorized Access"));
    }
  });



  io.on("connection", (socket) => {

    const { deviceId, userId, offlineMsg } = socket

    // console.log("User connected", socket.handshake.headers);
    // console.log("Id", socket.id);
    // console.log(deviceId, '***')
    // console.log(socket, '***');

    if (offlineMsg.length) {
      const fromSocketId = deviceSocketMap[deviceId];
      io.to(fromSocketId).emit('offlineMsg', offlineMsg);
      removeOfflineMessage(deviceId);
    }


    socket.on("c2s_message", async ({ toDeviceId, message }) => {
      // console.log(deviceId, toDeviceId, message, '***c2s');
      const isReceiverAllowed = userDeviceMap[userId].includes(toDeviceId);

      if (!isReceiverAllowed) {
        console.log('Unauthorized Message')
        return new Error("Unauthorized Access");
      }

      const targetSocketId = deviceSocketMap[toDeviceId];
      if (targetSocketId) {
        io.to(targetSocketId).emit('s2c_message', { from: deviceId, message });
      } else {
        console.log('receiver is not online');
        saveOfflineMessage(toDeviceId, message, deviceId)
      }

    })
  });
};

export { handleSocketConnection };
