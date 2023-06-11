const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

const { socialRegister } = require('../service/auth/authServices');

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      passReqToCallback: true,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const [firstName, lastName] = profile.displayName.split(' ');
      const defaultUser = {
        firstName,
        lastName,
        email: profile.emails[0].value
      };

      try {
        const user = await socialRegister(defaultUser);

        if (user) {
          return done(null, user);
        }
      } catch (error) {
        const err = {
          status: 400,
          message: 'Error signing up',
          param: 'user'
        };
        done(err, null);
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
