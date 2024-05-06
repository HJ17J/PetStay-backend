const express = require("express");
const passport = require("passport");
const router = express.Router();

// kakao 로그인 라우트
router.get("/kakao", passport.authenticate("kakao"));

// kakao 로그인 콜백 라우트
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  function (req, res) {
    // 성공적으로 로그인 후 localhost:3000으로 리다이렉트
    console.log("req.session--->>>", req.session);
    res.redirect(`http://localhost:3000`);
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
