const { where, Op } = require("sequelize");
const model = require("../models");
const { Users, Sitters, Reviews, sequelize, Sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { EMRServerless } = require("aws-sdk");

// 회원가입 -형석
const salt = 10;
exports.postJoin = async (req, res) => {
  const t = await model.sequelize.transaction();
  try {
    console.log("req.body >>> ", req.body);
    const {
      userid,
      userpw,
      name,
      address,
      usertype,
      type,
      license,
      career,
      oneLineIntro,
      selfIntroduction,
      pay,
    } = req.body;
    const userExists = await model.Users.findOne({
      where: {
        [Op.or]: [{ userid: userid }, { name: name }],
      },
      transaction: t,
    });
    if (userExists) {
      await t.rollback();
      return res.status(409).send({
        message: userExists.userid === userid ? "중복된 아이디입니다." : "중복된 닉네임입니다.",
      });
    }
    const defaultImgURL = "/static/joinImg.png"; // 이미지 경로 수정
    const hashedPassword = await bcrypt.hash(userpw, salt);
    const newUser = await model.Users.create(
      {
        userid: userid,
        userpw: hashedPassword,
        name: name,
        address: address,
        img: defaultImgURL,
        usertype: usertype,
      },
      { transaction: t }
    );

    if (usertype === "sitter") {
      if (!type || !oneLineIntro || !selfIntroduction || !pay) {
        await t.rollback();
        return res.status(400).send({ message: "모든 sitter 정보를 입력해야 합니다." });
      }
      await model.Sitters.create(
        {
          useridx: newUser.useridx, // 새롭게 생성된 유저의 ID
          type,
          license,
          career,
          oneLineIntro,
          selfIntroduction,
          pay,
          confirm: true,
        },
        { transaction: t }
      );
    }
    await t.commit();
    req.session.user = newUser; // 세션에 사용자 정보 저장
    res.send({ msg: "회원가입 완료!", statusCode: 200 });
  } catch (error) {
    console.log("회원가입 중 에러 발생", error);
    res.status(500).send("회원가입 실패(서버 오류)");
  }
};
exports.idCheck = async (req, res) => {
  try {
    const { userid } = req.body;
    const idCheck = await model.Users.findOne({
      where: { userid: userid },
    });
    if (idCheck) {
      return res.status(409).send({
        isAvailable: false,
        message: "중복된 아이디입니다.",
      });
    }
    res.send({ isAvailable: true, message: "사용가능한 아이디 입니다." });
  } catch (error) {
    console.error("아이디 중복 확인 중 에러 발생", error);
    res.status(500).send("아이디 중복 확인 실패");
  }
};

exports.nameCheck = async (req, res) => {
  try {
    const { name } = req.body;
    const nameCheck = await model.Users.findOne({
      where: { name: name },
    });
    if (nameCheck) {
      return res.status(409).send({
        isAvailable: false,
        message: "중복된 닉네임입니다.",
      });
    }
    res.send({ isAvailable: true, message: "사용가능한 닉네임입니다." });
  } catch (error) {
    console.error("닉네임 중복 확인 중 에러 발생", error);
    res.status(500).send("닉네임 중복 확인 실패");
  }
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

    // 사용자 정보를 세션에 저장
    req.session.user = {
      id: user.useridx,
      name: user.name,
      usertype: user.usertype,
    };
    res.send({ msg: `환영합니다. ${user.name}님!`, statusCode: 200 });
  } catch (error) {
    console.error(`로그인 중 에러 발생 : ${error.message}`);
    res.status(500).send("로그인 중 오류가 발생했습니다.");
  }
};
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(`세션 파괴 중 에러 발생 : ${err}`);
      return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
    }
    res.send({ message: "성공적으로 로그아웃되었습니다.", statusCode: 200 });
    // res.redirect("/")
  });
};

//회원 탈퇴
exports.deleteProfile = async (req, res) => {
  const { useridx } = req.params; // URL 파라미터에서 useridx 추출
  const { userpw } = req.body; // 요청 본문에서 비밀번호 추출
  try {
    // 사용자 조회
    const user = await model.Users.findByPk(useridx);
    console.log("user >>> ", user);
    if (!user) {
      return res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    }
    // 비밀번호 비교
    if (!userpw || !user.userpw) {
      return res.status(400).send({ message: "비밀번호 입력이 필요합니다." });
    }
    const isMatch = await bcrypt.compare(userpw, user.userpw);
    if (!isMatch) {
      return res.status(401).send({ message: "비밀번호가 다릅니다." });
    }
    // 사용자 삭제
    await model.Users.destroy({
      where: { useridx: user.useridx },
    });
    res.send({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.log(`회원탈퇴 중 오류 발생 : ${error.message}`);
    res.status(500).send("회원탈퇴 중 오류가 발생했습니다.");
  }
};

exports.postProfile = async (req, res) => {
  try {
    console.log("id>>>>>>>>>>>>>>>>", req.session.user.id);
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
    const { userid, name, address, type, license, career, oneLineIntro, selfIntroduction, pay } =
      req.body;

    let updateFields = {
      userid,
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
          oneLineIntro,
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

exports.updatePw = async (req, res) => {
  try {
    const { useridx } = req.params;
    const { userpw, newpw } = req.body;

    //현재 비밀번호 검증
    const password = await model.Users.findOne({
      attributes: ["userpw"],
      where: { useridx },
    });
    console.log(password.userpw);
    const match = await bcrypt.compare(userpw, password.userpw);
    if (!match) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    //비밀번호 수정
    const hashedPassword = await bcrypt.hash(newpw, salt);
    await model.Users.update({ userpw: hashedPassword }, { where: { useridx } });

    res.status(200).send({ message: "비밀번호 수정 완료" });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

// 펫시터 상세 정보 조회
exports.getSitterInfo = async (req, res) => {
  try {
    // users, sitters join
    const { useridx: sitteridx } = req.params;
    const [sData] = await model.Users.findAll({
      attributes: ["useridx", "userid", "name", "img", "usertype", "address"],
      where: { useridx: sitteridx },
      include: [{ model: model.Sitters }],
    });
    console.log("sData>>>>>>>>>>>>>>>", sData);
    const { useridx, userid, name, img, usertype: userType, address } = sData.dataValues;
    const {
      type: animalType,
      license,
      career,
      oneLineIntro: shortIntro,
      selfIntroduction,
      pay,
      confirm,
    } = sData.dataValues.Sitter.dataValues;

    // 평점 및 리뷰 개수 조회
    const [{ reviewCount, rating }] = await model.Reviews.findAll({
      attributes: [
        [
          sequelize.fn("COALESCE", sequelize.fn("COUNT", sequelize.col("reviewidx")), 0),
          "reviewCount",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("rate")), 1),
            0
          ),
          "rating",
        ],
      ],
      raw: true,
      where: { sitteridx: sitteridx },
    });

    const sitterInfo = {
      useridx,
      userid,
      name,
      address,
      img,
      userType,
      animalType,
      license,
      career,
      shortIntro,
      selfIntroduction,
      pay,
      confirm,
      reviewCount,
      rating,
    };

    // 리뷰 페이지네이션 추후 추가
    const rvData = await model.Reviews.findAll({
      include: [
        {
          model: model.Users,
          on: { "$User.useridx$": { [Op.eq]: sequelize.col("Reviews.useridx") } },
          attributes: ["useridx", "name", "img"],
        },
      ],
      order: [["createdAt", "DESC"]],
      where: { sitteridx: sitteridx },
    });

    const reviews = rvData.map((el) => {
      const {
        User: { name, img },
      } = el.dataValues;
      el.dataValues.name = name;
      el.dataValues.img = img;
      delete el.dataValues.User;
      return el.dataValues;
    });

    res.status(200).json({
      isSuccess: true,
      sitterInfo: sitterInfo,
      reviews: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, msg: "정보 조회 실패" });
  }
};

// 펫시터 목록 조회 (+쿼리스트링 검색)
exports.getSitterLists = async (req, res) => {
  try {
    let where = { usertype: "sitter" };
    if (Object.keys(req.query).length) {
      const [option] = Object.keys(req.query);
      const [keyword] = Object.values(req.query);
      where[option] = { [Op.substring]: keyword };
    }
    const data = await Users.findAll({
      attributes: [
        "useridx",
        "userid",
        "name",
        "address",
        "img",
        [Sequelize.literal("Sitter.type"), "animalType"],
        [Sequelize.literal("COALESCE(Sitter.pay, 0)"), "pay"],
        [Sequelize.literal("Sitter.oneLineIntro"), "shortIntro"],
        [Sequelize.literal("COALESCE(COUNT(Reviews.reviewidx), 0)"), "reviewCount"],
        [Sequelize.literal("COALESCE(ROUND(AVG(Reviews.rate), 1), 0)"), "rating"],
      ],
      include: [
        {
          model: Sitters,
          attributes: [],
          required: false,
        },
        {
          model: Reviews,
          attributes: [],
          required: false,
        },
      ],
      where: where,
      group: ["Users.useridx", "Sitter.oneLineIntro", "Sitter.pay", "Sitter.type"],
      order: [["useridx", "ASC"]],
    });
    console.log(data);
    res.status(200).json({ isSuccess: true, data: data });
  } catch (error) {
    console.log(error);
    res.status(200).json({ isSuccess: false, msg: "목록 조회 실패" });
  }
};
