const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const db = require("../models");
const Users = db.Users;
const PORT = process.env.PORT;
const axios = require("axios");

// 카카오 로그인 부분
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/kakao/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("profile--->>>", profile);
      try {
        const user = await Users.findOrCreate({
          where: { userid: profile.id.toString() }, // 카카오 ID를 문자열로 변환
          defaults: {
            userid: profile.id.toString(), // 카카오 ID
            userpw: null, // 비밀번호는 null
            name: profile.username, // 카카오 닉네임
            address: "비어있음", //
            img: profile._json.properties.profile_image, // 프로필 이미지 URL
            usertype: "user",
          },
        });
        return done(null, user[0]);
      } catch (error) {
        console.log("카카오 로그인 중 에러 발생", error);
        return done(error);
      }
    },
    console.log("session --->>> ")
  )
);

// 구글 로그인 부분
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      // Google People API에서 추가 정보 요청
      const userInfoUrl = "https://people.googleapis.com/v1/people/me";
      const params = {
        personFields: "names,emailAddresses",
        access_token: accessToken,
      };
      try {
        const response = await axios.get(userInfoUrl, { params });
        const userInfo = response.data;
        const user = await Users.findOrCreate({
          where: { userid: userInfo.emailAddresses[0].value },
          defaults: {
            userid: userInfo.emailAddresses[0].value,
            userpw: null,
            name: userInfo.names[0].displayName,
            img: userInfo.photos ? userInfo.photos[0].value : null,
            address: "비어있음",
            usertype: "user",
          },
        });
        return done(null, user);
      } catch (error) {
        console.error("구글 로그인 중 에러 발생", error);
        return done(error);
      }
    }
  )
);

// Passport 세션 설정
passport.serializeUser((user, done) => {
  done(null, { id: user.useridx, name: user.name, usertype: user.usertype });
});

passport.deserializeUser((sessionData, done) => {
  // 세션에 저장된 정보를 기반으로 사용자 정보 복원
  Users.findByPk(sessionData.id)
    .then((user) => {
      if (user) {
        done(null, { id: user.useridx, name: user.name, usertype: user.usertype });
      } else {
        done(null, false);
      }
    })
    .catch((err) => done(err, false));
});
