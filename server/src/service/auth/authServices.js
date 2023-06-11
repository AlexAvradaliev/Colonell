const User = require('../../models/User');
const { createOtp } = require('../../utils/otp');
const { hash, compare } = require('../../utils/passwordHash');
const { errorWrapper } = require('../../utils/errorWrapper');
const { createAccessToken, createRefreshToken } = require('../../utils/tokens');
const { generateHash } = require('../../utils/generateHash');

exports.register = async (firstName, lastName, email, password) => {
  try {
    const existing = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (existing) {
      const err = {
        status: 400,
        message: `${email} already exists`,
        param: 'email'
      };
      throw errorWrapper([err]);
    }

    const newOtp = createOtp();

    const user = new User({
      firstName,
      lastName,
      email,
      password: await hash(password),
      otp: newOtp.generate,
      otp_expiry_time: newOtp.expiry_time
    });

    await user.save();
    // sendMail(user, 'otp');

    return null;
  } catch (err) {
    throw err;
  }
};

exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const errs = [
        {
          status: 400,
          message: `Email or password is incorrect`,
          param: 'email'
        },
        {
          status: 400,
          message: `Email or password is incorrect`,
          param: 'password'
        }
      ];
      throw errorWrapper(errs);
    }

    if (user.password) {
      const match = await compare(password, user.password);

      if (!match) {
        const errs = [
          {
            status: 400,
            message: `Email or password is incorrect`,
            param: 'email'
          },
          {
            status: 400,
            message: `Email or password is incorrect`,
            param: 'password'
          }
        ];
        throw errorWrapper(errs);
      }
    } else {
      const err = {
        status: 401,
        message: `Please verify your ${email}`,
        param: 'email'
      };
      throw errorWrapper([err]);
    }

    if (!user.verified) {
      const err = {
        status: 403,
        message: `Please verify your ${email}`,
        param: 'email'
      };
      throw errorWrapper([err]);
    }

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      accessToken: await createAccessToken(user._id),
      refreshToken: await createRefreshToken(user._id)
    };
  } catch (err) {
    throw err;
  }
};

exports.newOtp = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  if (user.verified) {
    return;
  }

  const newOtp = createOtp();
  (user.otp = newOtp.generate), (user.otp_expiry_time = newOtp.expiry_time);
  await user.save();
  return;
};

exports.verifyOtp = async (email, otp) => {
  try {
    const user = await User.findOne({
      email,
      otp_expiry_time: { $gt: Date.now() }
    });
    if (!user) {
      const err = {
        status: 400,
        message: `${email} is invalid, confirmation code expired or confirmation code is invalid`,
        param: 'message'
      };
      throw errorWrapper([err]);
    }

    if (user.verified) {
      const err = {
        status: 400,
        message: `${email} is already verified`,
        param: 'message'
      };
      throw errorWrapper([err]);
    }

    if (user.otp != otp) {
      const err = {
        status: 400,
        message: 'Confirmation code is invalid',
        param: 'message'
      };
      throw errorWrapper([err]);
    }

    user.verified = true;
    user.otp = undefined;
    user.otp_expiry_time = undefined;
    await user.save();
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      accessToken: await createAccessToken(user._id),
      refreshToken: await createRefreshToken(user._id)
    };
  } catch (err) {
    throw err;
  }
};

exports.forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = {
        status: 400,
        message: 'There is no user with email address.',
        param: 'email'
      };
      throw errorWrapper([err]);
    }

    if (!user.verified) {
      const err = {
        status: 400,
        message: 'Confirm your email',
        param: 'email'
      };
      throw errorWrapper([err]);
    }

    user.passwordResetToken = generateHash();
    user.passwordResetExpires = Date.now() + 20 * 60 * 1000;
    user.passwordChangedAt = Date.now();
    await user.save();

    const resetURL = process.env.RESET_URL + user.passwordResetToken;
    // sendMail;
  } catch (err) {
    throw err;
  }
};

exports.resetPassword = async (token, password) => {
  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      const err = {
        status: 400,
        message: 'Link is Invalid or Expired',
        param: 'email'
      };
      throw errorWrapper([err]);
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      accessToken: await createAccessToken(user._id),
      refreshToken: await createRefreshToken(user._id)
    };
  } catch (err) {
    throw err;
  }
};

exports.socialRegister = async ({ email, firstName, lastName }) => {
  try {
    const existing = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (existing) {
      return existing;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      verified: true
    });

    await user.save();

    return user;
  } catch (err) {
    throw err;
  }
};

exports.socialUser = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      const err = {
        status: 400,
        message: 'Error signing up',
        param: 'user4'
      };
      throw errorWrapper([err]);
    }

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      accessToken: await createAccessToken(user._id),
      refreshToken: await createRefreshToken(user._id)
    };
  } catch (err) {
    throw err;
  }
};
