const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const { socialRegister } = require('../service/auth/authServices');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      const defaultUser = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
      };
      try {
        const user = await socialRegister(defaultUser);
        if (user) {
          req.session.user = user;
          return cb(null, user);
        }
      } catch (error) {
        const err = {
          status: 400,
          message: 'Error signing up',
          param: 'user'
        };
        cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser(async (user, cb) => {
  try {
    if (user) cb(null, user);
  } catch (error) {
    const err = {
      status: 400,
      message: 'Error signing up',
      param: 'user'
    };
    cb(err, null);
  }
});
