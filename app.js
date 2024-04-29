const express = require("express");
const session = require("express-session");
const { sequelize, Users } = require("./models");
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
// 소셜 로그인
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;

// bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// --- session 미들웨어 설정 ---
app.use(
  session({
    secret: process.env.socialSecretKey || "sesac", // 수정
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);
// --- session 미들웨어 설정 ---

// 소셜 로그인 세션 설정
app.use(
  session({
    secret: process.env.socialSecretKey,
    resave: false,
    saveUninitialized: true,
  })
);

// 패스포트 초기화
app.use(passport.initialize());
app.use(passport.session());
//패스포트 세션 설정
passport.serializeUser((user, done) => {
  done(null, user.useridx); // userid?
});
passport.deserializeUser((id, done) => {
  Users.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch(done);
});
// google oautu 설정
// passport.use(
//   new googleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:"/auth/google/callback"
//   },
//     (accessToken, refreshToken, profile, done) => {
//       const googleId = profile.id;
//       const email = profile.emails[0].valuse;
//       const name = profile.displayName;

//       Users.findOne({
//         where:{googleId}
//       }).then((existingUser) => {
//         if (existingUser) {
//           return done(null, existingUser)
//         }
//         Users.create({
//           googleId,
//           email,
//           name,
//           userid: email,
//           userpw:
//         })
//       })

//   }
//   )
// );

// 구글 로그인 라우트 설정
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({
      success: true,
      message: "인증에 성공했습니다.",
      user: req.user,
    });
  }
);

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
