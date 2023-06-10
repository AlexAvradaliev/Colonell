const { body } = require('express-validator');

const PasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/;

exports.validateRegister = [
  body('firstName').trim().escape(),

  body('lastName').trim().escape(),

  body('email').trim().escape().toLowerCase(),

  body('password').trim(),

  body('firstName').notEmpty().withMessage('The First name is required'),

  body('lastName').notEmpty().withMessage('The Last name is required'),

  body('email').isEmail().withMessage('The Email must be a be valid')

  // body('password')
  //   .matches(PasswordPattern, 'i')
  //   .withMessage(' Password must contain 8 characters, one Uppercase, one Lowercase, one Number and one Special case character')
];

exports.validateLogin = [
  body('email').trim().escape().toLowerCase(),
  body('password').trim(),
  body('email').isEmail().withMessage('The Email must be a be valid'),
  body('password').notEmpty().withMessage('The Password is required')
];

exports.validateSendOTP = [body('email').trim().escape().toLowerCase(), body('email').isEmail().withMessage('The Email must be a be valid')];

exports.validateOTP = [
  body('email').trim().escape().toLowerCase(),
  body('otp').trim().escape(),
  body('email').isEmail().withMessage('The Email must be a be valid'),
  body('otp').isInt().withMessage('The comfirmation code must be a be valid number')
];

exports.validateResetPassword = [
  body('password').trim(),
  body('password')
    .matches(PasswordPattern, 'i')
    .withMessage(' Password must contain 8 characters, one Uppercase, one Lowercase, one Number and one Special case character'),
  body('token').notEmpty().withMessage('Link is Invalid or Expired')
];
