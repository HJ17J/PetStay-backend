const model = require("../models");

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
