import { jwtAuth } from "../middlewares/userAuthMiddleware.js";

const handleSocketConnection = (io) => {
  const deviceSocketMap = {};
  const userDeviceMap = {};

  io.use(async (socket, next) => {
    try {
      const { deviceid, authorization } = socket.handshake.headers;
      const userData = await jwtAuth(authorization)
      const userId = userData._id.toString();
      const deviceIds = userData.deviceIds.map((item) => item._id.toString());
      const isValidDevice = userId && deviceIds.includes(deviceid);

      // console.log(userId, deviceIds, isValidDevice, '***u')

      if (isValidDevice) {
        deviceSocketMap[deviceid] = socket.id;
        userDeviceMap[userId] = deviceIds;
        // console.log(deviceSocketMap, userDeviceMap, '***');
        socket.deviceId = deviceid;
        socket.userId = userId;

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

    const { deviceId, userId } = socket

    // console.log("User connected", socket.handshake.headers);
    // console.log("Id", socket.id);
    // console.log(deviceId, '***')
    // console.log(socket, '***');


    socket.on("c2s_message", ({ toDeviceId, message }) => {
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
        console.log('receiver is not online')
      }

    })




  });
};

export { handleSocketConnection };
