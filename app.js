require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { sequelize } = require("./models");
const cors = require("cors");
const app = express();
const passport = require("passport");
//routes
const indexRouter = require("./routes");
const authRouter = require("./routes/auth");

// passport 설정
require("./config/passport"); // google 및 kakao 설정

// const dotenv = require("dotenv");
// dotenv.config();
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
app.use(cors({ origin: true, credentials: true }));

// --- session 미들웨어 설정 ---
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 36000000,
      secure: false,
    },
  })
);
// --- session 미들웨어 설정 ---
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);
app.use(serverPrefix, indexRouter);

//db
sequelize
  .sync({ force: false })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
      console.log("http://13.124.54.214/");
    });
  })
  .catch((err) => {
    console.log(err);
  });
