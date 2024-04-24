const express = require("express");
const router = express.Router();
// controller
const Cuser = require("../controller/Cuser");
const Cchat = require("../controller/Cchat");
const Creservation = require("../controller/Creservation");
const Creview = require("../controller/Creview");

// /api-server
//회원정보 조회
router.post("/profile/:useridx", Cuser.postProfile);

// 리뷰 등록
router.post("/review/:resvidx", Creview.addReview);

module.exports = router;
