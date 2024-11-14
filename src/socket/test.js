const handleSocketConnection = (io) => {


//   io.use((socket, next) => {
//     const usernameFrom = socket.handshake.auth.usernameFrom;
//     console.log(usernameFrom, "***from");
//     if (!usernameFrom) {
//       return next(new Error("invalid username"));
//     }
//     socket.usernameFrom = usernameFrom;
//     next();
//   });


  io.on("connection", (socket) => {
    console.log("User connected");
    console.log("Id", socket.id);

    socket.on("getUserId", async (userName) => {
      const sockets = await io.fetchSockets();
      if (sockets.length > 0) {
        const toData = sockets.filter((item) => {
          return item.usernameFrom === userName;
        });
        console.log(toData[0]?.id, "***");
        socket.emit("receiveUserId", toData[0]?.id || null);
      }
    });

    socket.on("c2s-message", ({ content, to, from }) => {
      console.log(content, to);
      if (to) {
        socket.to(to).emit("s2c-message", { message: content, from: from });
      }
    });
  });
};

export { handleSocketConnection };
