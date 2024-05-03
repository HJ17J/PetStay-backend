const model = require("../models");

// 리뷰 등록
exports.addReview = async (req, res) => {
  try {
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }
    const { sitteridx, content, rate } = req.body;
    const img = req.file?.location ? req.file.location : null;

    // 예약 확정 여부 조회
    const { confirm: isConfirmed } = await model.Reservations.findOne({
      attributes: ["confirm"],
      where: { resvidx: req.params.resvidx },
    });

    // 완료된 예약 건이 아닐 경우
    if (isConfirmed != "done") {
      return res.status(400).json({ isSuccess: false, msg: "서비스 완료 시점이 아님" });
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

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
  try {
    const reviewidx = req.params.reviewidx;

    // 작성자 본인 확인
    const { useridx } = model.Reviews.findOne({
      attributes: ["useridx"],
      where: { reviewidx: reviewidx },
    });

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
    const useridx = req.session.user.id;
    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }
    // 추후 페이지네이션 추가 필요
    const result = await model.Reviews.findAll({ where: { useridx } });
    const reviews = result.map((el) => el.dataValues);
    res.status(200).json({ isSuccess: true, data: reviews });
  } catch (error) {
    res.status(500).json({ isSuccess: false, msg: "리뷰 조회 실패" });
  }
};
