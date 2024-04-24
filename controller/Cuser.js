const { where } = require("sequelize");
const model = require("../models");
const bcrypt = require("bcrypt");

// --- 회원가입 페이지 렌더링 ---
exports.getJoin = (req, res) => {
  // res.render("join");
  res.send("---res.render(join)");
};
// --- 회원가입 --- 형석
const salt = 10;
exports.postJoin = async (req, res) => {
  try {
    console.log("req.body >>> ", req.body);

    const defaultImgURL = "/static/joinImg.png"; // 이미지 경로 수정
    const hashedPassword = await bcrypt.hash(req.body.userpw, salt);
    const newUser = await model.Users.create({
      userid: req.body.userid,
      userpw: hashedPassword,
      name: req.body.name,
      address: req.body.address,
      img: defaultImgURL,
      usertype: req.body.usertype,
    });
    req.session.user = newUser; // 세션에 사용자 정보 저장
    res.send({ msg: "회원가입 완료!", statusCode: 200 });
    // res.redirect("/");
  } catch (error) {
    console.log("회원가입 중 에러 발생", error);
    res.status(500).send("회원가입 실패(서버 오류)");
  }
};
// --- 회원가입 끝---

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
