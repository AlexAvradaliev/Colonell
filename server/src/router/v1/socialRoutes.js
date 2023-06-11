const router = require('express').Router();
const passport = require('passport');

require('dotenv').config();
require('../../passport/passportGoogle');
require('../../passport/passportLinkedIn');

const { isAuthenticated } = require('../../middlewares/guards');
const { socialUser } = require('../../service/auth/authServices');

router.use(passport.initialize());
router.use(passport.session());

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureMessage: 'Cannot login to Google, please try again later!',
    failureRedirect: process.env.GOOGLE_ERROR_LOGIN_URL,
    successRedirect: process.env.GOOGLE_SUCCESS_LOGIN_URL
  })
);

router.get('/login/linkedin', passport.authenticate('linkedin'));

router.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: process.env.LINKEDIN_ERROR_LOGIN_URL,
    successRedirect: process.env.LINKEDIN_SUCCESS_LOGIN_URL
  })
);

router.get('/auth/user', isAuthenticated, async (req, res) => {
  const user = await socialUser(req.users._id);

  res.status(200).json(user);
});

module.exports = router;
