const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const { socialRegister, socialUser } = require('../service/auth/authServices');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, _, _, profile, cb) => {
      const defaultUser = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value
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
          param: 'user1'
        };
        cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await socialUser(id);
    if (user) cb(null, user);
  } catch (error) {
    const err = {
      status: 400,
      message: 'Error signing up',
      param: 'user2'
    };
    cb(err, null);
  }
});
