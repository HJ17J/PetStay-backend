const { where, Op } = require("sequelize");
const model = require("../models");
const bcrypt = require("bcrypt");

// 회원가입 페이지 렌더링 -형석
exports.getJoin = (req, res) => {
  // res.render("join");
  res.send("---res.render(join)");
};
// 회원가입 -형석
const salt = 10;
exports.postJoin = async (req, res) => {
  try {
    console.log("req.body >>> ", req.body);
    const { userid, userpw, name, address, usertype } = req.body;
    const userExists = await model.Users.findOne({
      where: {
        [Op.or]: [{ userid: userid }, { name: name }],
      },
    });
    if (userExists) {
      return res.status(409).send({
        message: userExists.userid === userid ? "중복된 아이디입니다." : "중복된 닉네임입니다.",
      });
    }
    const defaultImgURL = "/static/joinImg.png"; // 이미지 경로 수정
    const hashedPassword = await bcrypt.hash(userpw, salt);
    const newUser = await model.Users.create({
      userid: userid,
      userpw: hashedPassword,
      name: name,
      address: address,
      img: defaultImgURL,
      usertype: usertype,
    });
    req.session.user = newUser; // 세션에 사용자 정보 저장
    res.send({ msg: "회원가입 완료!", statusCode: 200 });
  } catch (error) {
    console.log("회원가입 중 에러 발생", error);
    res.status(500).send("회원가입 실패(서버 오류)");
  }
};

// 로그인 -형석
exports.getLogin = (req, res) => {
  // res.render("login");
  res.send("---res.render(Login)");
};
exports.postLogin = async (req, res) => {
  const { userid, userpw } = req.body;
  try {
    const user = await model.Users.findOne({
      where: { userid: userid },
    });
    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const match = await bcrypt.compare(userpw, user.userpw);
    if (!match) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    // 세션 재생성을 위한 기존 세션 파괴
    req.session.regenerate((err) => {
      if (err) {
        console.error(`세션 재생성 중 에러 발생 : ${err}`);
        return res.status(500).send("세션 처리 중 오류가 발생했습니다.");
      }

      // 사용자 정보를 세션에 저장
      req.session.user = {
        id: user.useridx,
        name: user.name,
        usertype: user.usertype,
      };
      res.send({ msg: `환영합니다. ${user.name}님!`, statusCode: 200 });
    });
  } catch (error) {
    console.error(`로그인 중 에러 발생 : ${error.message}`);
    res.status(500).send("로그인 중 오류가 발생했습니다.");
  }
};

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
