const { where } = require("sequelize");
const model = require("../models");

// 문의하기 클릭 - 생성 or 기존 내역
exports.getChats = async (req, res) => {
  try {
    const { sitteridx } = req.params; //sitteridx
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }

    //나와 대화상대 정보 검색
    const user1 = await model.Users.findOne({ where: { useridx } });
    const sitter1 = await model.Users.findOne({ where: { useridx: sitteridx } });
    console.log("user1>>>>>>>>>>>>>>>", user1.dataValues.name);
    console.log("sitter1>>>>>>>>>>>>>>>", sitter1);
    const user = {
      name: user1.dataValues.name,
      img: user1.dataValues.img,
    };
    const sitter = {
      name: sitter1.dataValues.name,
      img: sitter1.dataValues.img,
    };

    //기존 room있는지 검색
    const room = await model.Rooms.findOne({ where: { useridx, sitteridx } });
    //없으면 생성
    if (!room) {
      const newRoom = await model.Rooms.create({
        useridx,
        sitteridx,
      });
      console.log("새방 ", newRoom);
      //현재방
      const roomidx = newRoom.dataValues.roomidx;
      const rooms = await model.Rooms.findAll({ where: { useridx } });
      res.status(200).send({ msg: "new", rooms, user, sitter, roomidx });
    } else {
      //현재방
      const roomidx = room.dataValues.roomidx;
      // console.log("roomidx>>", roomidx);
      //있으면 채팅 내역 조회
      // console.log("room있음");
      const chats = await model.Chats.findAll({ where: { roomidx } });
      // console.log(chats);
      const rooms = await model.Rooms.findAll({
        where: { useridx },
        include: {
          model: model.Users,
          where: { useridx: model.Sequelize.col("Rooms.sitteridx") },
          attributes: ["name", "img"],
        },
      });
      console.log("name포함 room목록>>", rooms[0].dataValues.User.dataValues.name);
      res.status(200).send({ msg: "get", rooms, chats, user, sitter, roomidx });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

// 채팅방 클릭시 - 기존 내역
exports.getRoomChats = async (req, res) => {
  try {
    const { roomidx } = req.params; //roomidx
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }

    // console.log("roomidx>>", roomidx);
    //있으면 채팅 내역 조회
    // console.log("room있음");
    const chats = await model.Chats.findAll({ where: { roomidx } });
    const sitterData = await model.Rooms.findOne({
      where: { roomidx },
      attributes: ["sitteridx"],
    });
    // console.log(sitterData);
    const sitteridx = sitterData.dataValues.sitteridx;
    // console.log(sitteridx);

    // // 나와 대화상대 정보 검색
    const user1 = await model.Users.findOne({ where: { useridx } });
    const sitter1 = await model.Users.findOne({ where: { useridx: sitteridx } });
    const user = {
      name: user1.dataValues.name,
      img: user1.dataValues.img,
    };
    const sitter = {
      name: sitter1.dataValues.name,
      img: sitter1.dataValues.img,
    };

    res.status(200).send({ msg: "get", chats, user, sitter, roomidx });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

// 채팅 내역 저장 글내용
exports.postChat = async (req, res) => {
  try {
    //필요데이터
    //roomidx, authoridx
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }
    const { content, roomidx } = req.body;
    console.log(content, roomidx);
    const saveChat = await model.Chats.create({
      content,
      roomidx,
      authoridx: useridx,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

// 채팅 내역 저장 사진
exports.postImg = async (req, res) => {
  try {
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }
    const { img, roomidx } = req.body;
    console.log("roomidx>>", roomidx);
    console.log("img ", req.file.location);
    const saveChat = await model.Chats.create({
      img: req.file.location,
      roomidx: Number(roomidx),
      authoridx: useridx,
    });
    // console.log(saveChat);
    res.status(200).send({ msg: "이미지전송", saveChat });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

// room목록 - mount시(개인 프로필 페이지)
