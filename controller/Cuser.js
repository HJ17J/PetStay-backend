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
      res.send(userdata);
    } else if (userData.usertype === "sitter") {
      const sitterData = await model.Sitters.findOne({
        where: { useridx },
      });
      res.send(userData, sitterData);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};
