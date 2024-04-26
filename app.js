const express = require("express");
const session = require("express-session");
const { sequelize } = require("./models");
const cors = require("cors");
const app = express();
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
app.use(cors());

// --- session 미들웨어 설정 ---
app.use(
  session({
    secret: "sesac", // 수정
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);
// --- session 미들웨어 설정 ---

//routes
const indexRouter = require("./routes");
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
