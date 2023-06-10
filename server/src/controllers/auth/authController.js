const { validationResult } = require('express-validator');
const { errorWrapper, mapperStatus } = require('../../utils/errorWrapper');
const { register, login, newOtp, verifyOtp, forgotPassword, resetPassword } = require('../../service/auth/authServices');
const { verifyRefreshToken, createAccessToken, createRefreshToken, removeRefreshToken } = require('../../utils/tokens');

exports.register = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw errorWrapper(mapperStatus(errors, 400));
    }
    const { firstName, lastName, email, password } = req.body;
    await register(firstName, lastName, email, password);
    res.status(201).json({ email, message: 'Confirmation email sent successfully!' });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw errorWrapper(mapperStatus(errors, 400));
    }
    const { email, password } = req.body;
    const result = await login(email, password);

    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.sendOTP = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw errorWrapper(mapperStatus(errors, 400));
    }
    await newOtp(req.body.email);
    res.status(200).json({ message: 'Confirmation email sent successfully!' });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw errorWrapper(mapperStatus(errors, 400));
    }

    const { email, otp } = req.body;
    const result = await verifyOtp(email, otp);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.forgot_Password = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      throw errorWrapper(mapperStatus(errors, 400));
    }

    await forgotPassword(req.body.email);
    res.status(200).json({ message: 'Reset password sent successfully!' });
  } catch (err) {
    next(err);
  }
};

exports.reset_Password = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await resetPassword(token, password);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.tokens = async (req, res, next) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);

    res.status(200).json({
      accessToken: await createAccessToken(user._id),
      refreshToken: await createRefreshToken(user._id)
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    removeRefreshToken(req.users._id);
    res.status(200).json({ message: 'succsess' });
  } catch (err) {
    next(err);
  }
};
