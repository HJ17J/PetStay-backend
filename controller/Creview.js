const model = require("../models");

exports.addReview = async (req, res) => {
  try {
    const { useridx, sitteridx, content, rate } = req.body;
    let img = req.body.img ? req.body.img : null;

    // 예약 확정 여부 확인 (추후 회원 session 추가하여 비교)
    const { confirm: isConfirmed } = await model.Reservations.findOne({
      attributes: ["confirm"],
      where: { resvidx: req.params.resvidx },
    });

    // 확정된 예약이 아닐 경우
    if (!isConfirmed) {
      return res.status(400).json({ isSuccess: false, msg: "확정된 예약이 아님" });
    }

    // 해당 예약 건에 리뷰가 존재하지 않는 경우에만 리뷰 추가
    const [newReview, created] = await model.Reviews.findOrCreate({
      where: { resvidx: req.params.resvidx },
      defaults: {
        content: content,
        img: img,
        rate: rate,
        resvidx: req.params.resvidx,
        useridx: useridx,
        sitteridx: sitteridx,
      },
    });

    // 이미 리뷰가 존재하는 경우
    if (!created) {
      return res.status(400).json({ isSuccess: false, msg: "이미 등록된 리뷰" });
    }

    res.status(200).json({
      isSuccess: true,
      data: newReview.dataValues,
      msg: "리뷰 등록 성공",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, msg: "리뷰 등록 실패" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewidx = req.params.reviewidx;
    // 작성자 본인 확인 (추후 회원 session 추가하여 비교)
    // const { useridx } = model.Reviews.findOne({
    //   attributes: ["useridx"],
    //   where: { reviewidx: reviewidx },
    // });
    // 리뷰 삭제
    const result = await model.Reviews.destroy({ where: { reviewidx: reviewidx } });
    if (result) {
      return res.status(200).json({ isSuccess: true, msg: "리뷰 삭제 성공" });
    }
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "리뷰 삭제 실패" });
  }
};

// 리뷰 조회 (회원 마이페이지)
exports.getUserReviews = async (req, res) => {
  try {
    const result = await model.Reviews.findAll({ where: { useridx: req.params.useridx } });
    const reviews = result.map((el) => el.dataValues);
    res.status(200).json({ isSuccess: true, data: reviews });
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "리뷰 조회 실패" });
  }
};
