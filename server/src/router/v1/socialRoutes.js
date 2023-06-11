const router = require('express').Router();
const passport = require('passport');
require('dotenv').config();
require('../../passport/passportGoogle');

const { isAuthenticated } = require('../../middlewares/guards');

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

router.get('/auth/user', isAuthenticated, (req, res) => {
  const user = req.session.user;
  res.clearCookie(req.headers['cookie'].split('=')[0]);
  res.status(200).json(user);
});

module.exports = router;
