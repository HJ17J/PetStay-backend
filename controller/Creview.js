const model = require("../models");
const { sequelize } = require("../models");
const { Op, where } = require("sequelize");

// 리뷰 등록
exports.addReview = async (req, res) => {
  try {
    const { resvidx } = req.params;
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }
    const { content, rate: rateString } = req.body;
    console.log("리뷰내용>>", content, "별점>>>", rateString);
    const resvData = await model.Reservations.findOne({ where: { resvidx } });
    // console.log("예약 데이터", resvData);
    const sitteridx = resvData.dataValues.sitteridx;
    const rate = Number(rateString);
    const img = req.file?.location ? req.file.location : null;
    console.log("사진이 있다면!!>>", img);

    // 해당 예약 건에 리뷰가 존재하지 않는 경우에만 리뷰 추가
    const [newReview, created] = await model.Reviews.findOrCreate({
      where: { resvidx: resvidx },
      defaults: {
        content: content,
        img: img,
        rate: rate,
        resvidx: resvidx,
        useridx: useridx,
        sitteridx: sitteridx,
      },
    });

    // 이미 리뷰가 존재하는 경우
    if (!created) {
      return res.status(200).json({ isSuccess: false, msg: "이미 등록된 리뷰입니다" });
    }

    res.status(200).json({
      isSuccess: true,
      data: newReview.dataValues,
      msg: "리뷰 등록 성공",
    });
  } catch (error) {
    console.log("error발생!!>>", error);
    res.status(500).json({ isSuccess: false, msg: "리뷰 등록 실패" });
  }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
  try {
    const reviewidx = req.params.reviewidx;

    // 작성자 본인 확인
    const user = await model.Reviews.findOne({
      attributes: ["useridx"],
      where: { reviewidx: reviewidx },
    });
    const useridx = user.dataValues.useridx;
    console.log("useridx>>", useridx);

    // 본인이 작성한 글인 경우에만 리뷰 삭제
    if (req.session.user.id === useridx) {
      const result = await model.Reviews.destroy({ where: { reviewidx: reviewidx } });
      return res.status(200).json({ isSuccess: true, msg: "리뷰 삭제 성공" });
    } else {
      return res.status(403).json({ isSuccess: false, msg: "접근 권한 없음" });
    }
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "리뷰 삭제 실패" });
  }
};

// 리뷰 조회 (회원 마이페이지)
exports.getUserReviews = async (req, res) => {
  try {
    const { resvidx } = req.params;
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }
    // 추후 페이지네이션 추가 필요
    const result = await model.Reviews.findAll({ where: { resvidx } });
    // const reviews = result.map((el) => el.dataValues);
    console.log("review가 있나?", result);
    res.status(200).json({ isSuccess: true, data: result });
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "리뷰 조회 실패" });
  }
};

// 리뷰 조회 (펫시터 상세페이지)
exports.getSitterReviews = async (req, res) => {
  try {
    const { sitteridx } = req.params;
    // 평점 및 리뷰 개수 조회
    const [{ reviewCount }] = await model.Reviews.findAll({
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

    // 리뷰 페이지네이션 추가
    const itemLimit = 3;
    const totalReviews = reviewCount;
    const totalPage = Math.ceil(totalReviews / itemLimit);

    let offset;
    const currentPage = Number(req.query.rvPage);

    if (currentPage === 0) {
      offset = 0;
    } else {
      offset = (currentPage - 1) * itemLimit;
    }

    const rvData = await model.Reviews.findAll({
      limit: itemLimit,
      offset: offset,
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
      el.dataValues.profileImg = img;
      delete el.dataValues.User;
      return el.dataValues;
    });
    res.status(200).json({ reviews: reviews, totalPage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "리뷰 조회 실패" });
  }
};
