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

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read", //파일 접근 권한
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

// controller
const Cuser = require("../controller/Cuser");
const Cchat = require("../controller/Cchat");
const Creservation = require("../controller/Creservation");
const Creview = require("../controller/Creview");

// /api-server

//회원가입, 회원탈퇴 - 형석
router.post("/join", Cuser.postJoin);
router.delete("/profile/:useridx", Cuser.deleteProfile);
//회원정보 조회
router.post("/profile/:useridx", Cuser.postProfile);
router.patch("/profile/:useridx", upload.single("profileImage"), Cuser.updateProfile);
router.patch("/profile/pwUpdate/:useridx", Cuser.updatePw);
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
router.post("/review/:resvidx", upload.single("reviewImage"), Creview.addReview);
// 리뷰 삭제
router.delete("/review/:reviewidx", Creview.deleteReview);
// 리뷰 조회 (회원 마이페이지)
router.get("/review/:useridx", Creview.getUserReviews);

// 시터 상세 정보
router.get("/sitter/:useridx", Cuser.getSitterInfo);
// 시터 전체 조회
router.get("/sitter", Cuser.getAllSitters);

module.exports = router;
