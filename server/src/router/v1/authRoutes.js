const router = require('express').Router();

const { register, login, sendOTP, verifyOTP, forgot_Password, reset_Password, tokens, logout } = require('../../controllers/auth/authController');
const { isAuth } = require('../../middlewares/guards');
const { validateRegister, validateLogin, validateSendOTP, validateOTP, validateResetPassword } = require('../../middlewares/validation/userValidation');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/sendOTP', validateSendOTP, sendOTP);
router.post('/verify', validateOTP, verifyOTP);
router.post('/forgot-password', validateSendOTP, forgot_Password);
router.post('/reset-password', validateResetPassword, reset_Password);
router.post('/tokens', tokens);
router.get('/logout',isAuth, logout);

module.exports = router;
