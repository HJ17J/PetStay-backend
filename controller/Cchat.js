const { where } = require("sequelize");
const model = require("../models");

// 문의하기 클릭 - 생성 or 기존 내역
exports.getChats = async (req, res) => {
  try {
    const { sitteridx } = req.params; //sitteridx
    const useridx = req.session.user.id; //useridx

    //기존 room있는지 검색
    const room = await model.Chats.findOne({ where: { useridx, sitteridx } });
    console.log(room);
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

// room목록 - mount시

// 채팅방 클릭시 - 기존 내역

// 채팅 내역 저장 content or img
