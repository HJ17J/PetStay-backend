const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const KakaoStrategy = require("passport").Strategy;
const Users = require("../models/Users").Users;
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
      console.log(profile);
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
    }
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
  done(null, user.useridx);
});

passport.deserializeUser((id, done) => {
  Users.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
