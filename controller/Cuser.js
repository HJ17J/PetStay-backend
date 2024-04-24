const { where } = require("sequelize");
const model = require("../models");

exports.postProfile = async (req, res) => {
  try {
    const { useridx } = req.params;
    const userData = await model.Users.findOne({
      where: { useridx },
    });
    //type별 data전송
    if (userData.usertype === "user") {
      const resvData = await model.Reservations.findAll({
        where: { useridx },
      });
      res.status(200).send({ userData, resvData });
    } else if (userData.usertype === "sitter") {
      const sitterData = await model.Sitters.findOne({
        where: { useridx },
      });
      const resvData = await model.Reservations.findAll({
        where: { sitteridx: useridx },
      });
      res.status(200).send({ userData, sitterData, resvData });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { useridx } = req.params;
    const userData = await model.Users.findOne({ where: { useridx } });
    const { userid, userpw, name, address, type, license, career, selfIntroduction, pay } =
      req.body;

    let updateFields = {
      userid,
      userpw,
      name,
      address,
    };

    // req.file이 존재하는 경우에만 img 필드 업데이트
    if (req.file) {
      updateFields.img = req.file.location;
    }

    await model.Users.update(updateFields, {
      where: { useridx },
    });

    // type에 따라 수정작업
    if (userData.usertype === "sitter") {
      await model.Users.update(
        {
          type,
          license,
          career,
          selfIntroduction,
          pay,
        },
        {
          where: { useridx },
        }
      );
      res.status(200).send({ msg: "펫시터 회원수정 완료" });
    } else {
      res.status(200).send({ msg: "일반 회원수정 완료" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};
