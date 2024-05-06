const express = require("express");
const router = express.Router();
//multer
const dotenv = require("dotenv");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
dotenv.config();

//aws 설정
aws.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const s3 = new aws.S3();

const uploadProfile = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, "profile-img/" + Date.now().toString() + "-" + file.originalname);
    },
  }),
});

const uploadReview = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, "review-img/" + Date.now().toString() + "-" + file.originalname);
    },
  }),
});

const uploadChat = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, "chat-img/" + Date.now().toString() + "-" + file.originalname);
    },
  }),
});

// controller
const Cuser = require("../controller/Cuser");
const Cchat = require("../controller/Cchat");
const Creservation = require("../controller/Creservation");
const Creview = require("../controller/Creview");

// /api-server

//회원가입, 회원탈퇴, userid, name 중복확인 - 형석
router.post("/join", Cuser.postJoin);
router.post("/idCheck", Cuser.idCheck);
router.post("/nameCheck", Cuser.nameCheck);
router.delete("/profile", Cuser.deleteProfile);
//회원정보 조회
router.post("/profile", Cuser.postProfile);
router.patch("/profile", uploadProfile.single("profileImage"), Cuser.updateProfile);
router.patch("/profile/pwUpdate", Cuser.updatePw);
//로그인, 로그아웃 - 형석
router.post("/login", Cuser.postLogin);
router.post("/logout", Cuser.postLogout);

//예약 신청
router.post("/resv/:sitteridx", Creservation.insertResv);
router.post("/resvDate/:sitteridx", Creservation.getDateResv);
//예약확정,거절, 취소 - 형석
router.patch("/reservation/:resvidx/confirm", Creservation.confirmReservation);
router.patch("/reservation/:resvidx/refused", Creservation.refusedReservation);
router.delete("/reservation/:resvidx/delete", Creservation.deleteReservation);

// 리뷰 등록
router.post("/review/:resvidx", uploadReview.single("reviewImage"), Creview.addReview);
// 리뷰 삭제
router.delete("/review/:reviewidx", Creview.deleteReview);
// 리뷰 조회 (회원 마이페이지)
router.get("/review/:resvidx", Creview.getUserReviews);
// 리뷰 조회 (펫시터 상세페이지)
router.get("/sitter/review/:sitteridx", Creview.getSitterReviews);

// 시터 목록 조회 + 검색
router.get("/sitter", Cuser.getSitterLists);
// 시터 상세 정보
router.get("/sitter/:sitteridx", Cuser.getSitterInfo);

//chat관련 router
router.get("/chat/:sitteridx", Cchat.getChats);
router.get("/chatRoom/:roomidx", Cchat.getRoomChats);
router.post("/insertChat", Cchat.postChat);
router.post("/insertImg", uploadChat.single("chatFile"), Cchat.postImg);
router.get("/Onechat", Cchat.getChatsOne);

module.exports = router;
