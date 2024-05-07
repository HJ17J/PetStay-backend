const { Op } = require("sequelize");
const { Users, Sitters, Reviews, sequelize, Sequelize } = require("../models");

// 펫시터 목록 조회 (+쿼리스트링 검색)
exports.getSitterLists = async (req, res) => {
  try {
    console.log("session을 보여줘!!!", req.session);
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

    // 동물 타입 배열로 변경
    const list = data.map((item) => {
      const animalType = item.dataValues.animalType.split(", ").map((el) => {
        return el === "dog" ? "강아지" : el === "cat" ? "고양이" : "기타";
      });
      return { ...item.dataValues, animalType };
    });
    console.log(list);

    res.status(200).json({ isSuccess: true, data: list });
  } catch (error) {
    console.log(error);
    res.status(200).json({ isSuccess: false, msg: "목록 조회 실패" });
  }
};

// 펫시터 상세 정보 조회
exports.getSitterInfo = async (req, res) => {
  try {
    const { sitteridx } = req.params;

    // 펫시터 정보 조회
    const [sData] = await Users.findAll({
      attributes: ["useridx", "userid", "name", "img", "usertype", "address"],
      where: { useridx: sitteridx },
      include: [{ model: Sitters }],
    });

    // 일반 회원이나 없는 회원번호로 요청 시
    if (!sData || sData.dataValues.usertype === "user") {
      return res.status(404).json({ msg: "잘못된 URL입니다." });
    }

    // 평점 및 리뷰 개수 조회
    const [{ reviewCount, rating }] = await Reviews.findAll({
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

    const { useridx, userid, name, img, usertype, address } = sData.dataValues;
    const {
      type,
      license,
      career,
      oneLineIntro: shortIntro,
      selfIntroduction,
      pay,
    } = sData.dataValues.Sitter.dataValues;

    // 동물 타입 배열로 변경
    const animalType = type
      .split(", ")
      .map((el) => (el === "dog" ? "강아지" : el === "cat" ? "고양이" : "그외"));

    const sitterInfo = {
      useridx,
      // userid,
      name,
      address,
      img,
      // usertype,
      animalType,
      license,
      career,
      shortIntro,
      selfIntroduction,
      pay,
      reviewCount,
      rating,
    };
    console.log(sitterInfo);

    res.status(200).json({
      isSuccess: true,
      sitterInfo: sitterInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, msg: "정보 조회 실패" });
  }
};
