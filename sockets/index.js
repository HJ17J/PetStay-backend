const socketIO = require("socket.io");
function socketHandler(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    //socket.on ~~
  });
}

module.exports = socketHandler;
