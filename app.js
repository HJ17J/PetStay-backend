const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const app = express();
//multer
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const serverPrefix = "/api-server";
//socket
const http = require("http");
const server = http.createServer(app);
const socketHandler = require("./sockets");
socketHandler(server);

// bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//routes
const indexRouter = require("./routes");
app.use(serverPrefix, indexRouter);

//aws 설정
aws.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const s3 = new aws.S3();
//s3 관련 multer설정
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

//db
sequelize
  .sync({ force: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log("server is open");
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = upload;
