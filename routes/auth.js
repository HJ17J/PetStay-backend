const express = require("express");
const passport = require("passport");
const router = express.Router();

// kakao 로그인 라우트
router.get("/kakao", passport.authenticate("kakao"));

// kakao 로그인 콜백 라우트
router.get(
  "kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  function (req, res) {
    res.json({
      success: true,
      message: "로그인 성공",
      user: {
        id: req.user.useridx, // 데이터베이스의 기본 키
        userid: req.user.userid, // 사용자 식별자
        name: req.user.name,
        email: req.user.email, // 이메일은 선택적으로 카카오에서 받을 수 있음
        img: req.user.img,
      },
    });
  }
);

// google 로그인 라우트
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// google 로그인 콜백 라우트
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.json({
      success: true,
      message: "로그인 성공",
      user: {
        id: req.user.id,
        name: req.user.name,
      },
    });
  }
);

module.exports = router;
