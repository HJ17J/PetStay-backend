const express = require("express");
const passport = require("passport");
const router = express.Router();

// google 로그인 라우트
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
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
