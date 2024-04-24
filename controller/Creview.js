const model = require("../models");

exports.addReview = async (req, res) => {
  try {
    // 예약 여부 확인
    const resvResult = await model.Reservations.findOne({ where: { resvidx: req.params.resvidx } });
    const isBooked = resvResult.dataValues.confirm;
    const { content, rate } = req.body;
    let img = req.body.img ? req.body.img : null;
    // 예약 존재할 경우에만 리뷰 추가
    if (isBooked) {
      const result = await model.Reviews.create({
        content: content,
        img: img,
        rate: rate,
        resvidx: req.params.resvidx,
      });
      res.json({
        isSuccess: true,
        statusCode: 200,
        data: result.dataValues,
        message: "리뷰 등록 성공",
      });
    } else {
      res.json({ isSuccess: false, statusCode: 500, message: "예약 없음" });
    }
  } catch (error) {
    console.log(error);
    res.json({ isSuccess: false, statusCode: 500, message: "리뷰 작성 실패" });
  }
};
