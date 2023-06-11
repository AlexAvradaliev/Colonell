const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
require('dotenv').config();

const { socialRegister, socialUser } = require('../service/auth/authServices');

passport.use(
  new LinkedInStrategy(
    {
      clientID: '78j38rly46j8vq',
      clientSecret: 'QpuzuMnJQWCs3jIb',
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['r_emailaddress', 'r_liteprofile']
    },
    async (token, tokenSecret, profile, done) => {
      console.log(profile);
      const defaultUser = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value
      };
      try {
        const user = await socialRegister(defaultUser);
        if (user) {
          // console.log(req)
          // req.session.user = user;
          return done(null, user);
        }
      } catch (error) {
        const err = {
          status: 400,
          message: 'Error signing up',
          param: 'user1'
        };
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
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
