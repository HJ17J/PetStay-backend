const { where } = require("sequelize");
const model = require("../models");

//setInterval - ("request", "approved", "refused", "done") 자정에 approved -> done으로 변경
async function updateConfirmStatus() {
  try {
    // 오늘 날짜
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await model.Reservations.update(
      { confirm: "done" },
      {
        where: {
          date: { [model.Sequelize.Op.lt]: today },
          confirm: "approved",
        },
      }
    );

    console.log("예약 내역 업데이트 완료");
  } catch (error) {
    console.error("예약 내역 업데이트 중 오류 발생>>", error);
  }
}

function runAtMidnight() {
  // 자정까지 남은 시간을 계산
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = midnight.getTime() - now.getTime();

  setInterval(updateConfirmStatus, timeUntilMidnight);
}

// 매일 자정 실행
runAtMidnight();

exports.insertResv = async (req, res) => {
  try {
    const { sitteridx } = req.params;
    const useridx = 2; //useridx test용
    const { content, date, startTime, endTime, type, animalNumber } = req.body;

    let sTime = Number(startTime.replace(":00", ""));
    let eTime = Number(endTime.replace(":00", ""));

    // 유저 세션
    // const useridx = req.session.user.id;
    console.log("useridx>>", req.session);
    console.log("user>>", req.session.user);

    // if (!useridx) {
    //   res.status(200).send({ msg: "session이 만료되었습니다" });
    // }

    // 시급 계산
    const { pay: sitterPay } = await model.Sitters.findOne({
      attributes: ["pay"],
      where: { useridx: sitteridx },
      raw: true,
    });
    const time = eTime - sTime + 1;
    const totalPrice = sitterPay * time * animalNumber;
    console.log("총금액 >>", totalPrice);

    // 예약 등록
    const resvData = await model.Reservations.create({
      content,
      date,
      price: totalPrice,
      useridx,
      sitteridx,
      startTime: sTime,
      endTime: eTime,
      type,
      animalNumber,
    });

    res.status(200).json({ isSuccess: true });
  } catch (err) {
    console.log("err", err);
    res.status(500).send("server err발생!!");
  }
};

exports.confirmReservation = async (req, res) => {
  const { resvidx } = req.params;
  console.log("resvidx >>> ", resvidx);
  try {
    const reservation = await model.Reservations.findByPk(resvidx);
    if (!reservation) {
      return res.status(404).send({ message: "예약이 존재하지 않습니다." });
    }
    reservation.confirm = "approved";
    await reservation.save();
    res.send({ message: "예약이 확정되었습니다.", reservation });
  } catch (error) {
    console.error("예약 확정 중 에러 발생 : ", error);
    res.status(500).send({ message: "예약 확정 처리 중 오류가 발생했습니다." });
  }
};

exports.refusedReservation = async (req, res) => {
  const { resvidx } = req.params;
  console.log("resvidx >>> ", resvidx);
  try {
    const reservation = await model.Reservations.findByPk(resvidx);
    if (!reservation) {
      return res.status(404).send({ message: "예약이 존재하지 않습니다." });
    }
    reservation.confirm = "refused";
    await reservation.save();
    res.send({ message: "예약이 거절되었습니다.", reservation });
  } catch (error) {
    console.error("예약 거절 중 오류 발생", error);
    res.status(500).send({ message: "예약 거절 중, 오류가 발생했습니다." });
  }
};

exports.deleteReservation = async (req, res) => {
  const { resvidx } = req.params;
  console.log("resvidx >>> ", resvidx);

  try {
    const reservation = await model.Reservations.findByPk(resvidx);
    if (!reservation) {
      return res.status(404).send({ message: "예약이 존재하지 않습니다." });
    }
    await reservation.destroy({
      where: { resvidx: resvidx },
    });
    res.send({ message: "예약이 취소되었습니다.", reservation });
  } catch (error) {
    console.error("예약 취소 중 오류 발생");
    res.status(500).send({ message: "예약 취소 중, 오류가 발생했습니다." });
  }
};

exports.getDateResv = async (req, res) => {
  try {
    const { sitteridx } = req.params;
    const { date } = req.body;
    console.log("날짜!!", date);
    const reservation = await model.Reservations.findAll({
      where: {
        sitteridx,
        date,
      },
    });
    console.log("예약!!!", reservation);
    res.send({ reservation });
  } catch (error) {
    console.error("서버 에러 발생");
    res.status(500).send({ message: "예약 내역 조회 중 오류가 발생했습니다." });
  }
};
