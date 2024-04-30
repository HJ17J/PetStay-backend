const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/Users").Users;
const PORT = process.env.PORT;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const user = await Users.findOrCreate({
        googleId: profile.id,
        defaults: { name: profile.displayName },
      });
      return done(null, user);
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
