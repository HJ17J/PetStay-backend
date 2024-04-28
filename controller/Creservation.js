const { where } = require("sequelize");
const model = require("../models");

exports.insertResv = async (req, res) => {
  try {
    const { sitteridx } = req.params; //sitteridx
    const useridx = req.session.user.id; //useridx
    // const useridx = 2; //useridx test용
    const { content, date, startTime, endTime, type, animalNumber } = req.body;

    if (!useridx) {
      res.status(200).send({ msg: "session이 만료되었습니다" });
    }

    //시급 계산
    const sitterPay = await model.Sitters.findOne({
      attributes: ["pay"],
      where: { useridx: sitteridx },
    });
    const time = endTime - startTime;
    const totalPrice = parseInt(sitterPay.pay) * time * Number(animalNumber);
    // console.log("총금액>>", totalPrice);

    //예약입력
    const resvData = await model.Reservations.create({
      content,
      date,
      price: totalPrice,
      useridx,
      sitteridx,
      startTime,
      endTime,
      type,
      animalNumber,
    });

    // res.status(200).send({ resvData });
    res.status(200).send({ msg: "예약요청이 완료되었습니다" });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};
