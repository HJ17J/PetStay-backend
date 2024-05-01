const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/Users").Users;
const PORT = process.env.PORT;
const axios = require("axios");

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
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
