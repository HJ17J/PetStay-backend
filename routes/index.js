const express = require("express");
const router = express.Router();
// controller
const Cuser = require("../controller/Cuser");
const Cchat = require("../controller/Cchat");
const Creservation = require("../controller/Creservation");
const Creview = require("../controller/Creview");

// /api-server

//회원가입
router.get("/join", Cuser.getJoin);
router.post("/join", Cuser.postJoin);

//회원정보 조회
router.post("/profile/:useridx", Cuser.postProfile);

module.exports = router;
