const { default: axios } = require("axios");
const socketIO = require("socket.io");
function socketHandler(server) {
  const io = socketIO(server, {
    cors: {
      origin: true,
    },
  });

  io.on("connection", (socket) => {
    //socket.on ~~
    socket.on("createRoom", (roomName) => {
      // console.log(roomName);
      socket.join(roomName);
      socket.room = roomName;
    });
    //메시지
    socket.on("send", (sendData) => {
      const { msg, myNick } = sendData;
      // console.log("전송 메시지>>>>>", msg);

      // console.log("현재 룸은<><>", socket.room);
      io.to(socket.room).emit("message", {
        message: msg,
        nickname: myNick,
        img: "",
      });
    });
    //이미지
    socket.on("image", (data) => {
      // console.log("현재 룸은<><>", socket.room);
      const imageData = data.img; // base64 인코딩된 이미지 데이터
      const myNick = data.myNick; // 보낸 사용자의 닉네임

      // console.log("imageData:", imageData);

      // 클라이언트로 이미지 파일 경로를 보내거나, 다른 처리를 수행할 수 있음
      io.to(socket.room).emit("img", {
        message: "",
        nickname: myNick,
        img: imageData,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = socketHandler;
