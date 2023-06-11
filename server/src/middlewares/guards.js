const { errorWrapper } = require('../utils/errorWrapper');
const { verifyAccessToken } = require('../utils/tokens');

const err = {
  status: 401,
  message: 'Please login!',
  param: 'auth'
};

exports.auth = () => async (req, _, next) => {
  try {
    const token = req.headers['x-authorization'];
    if (token) {
      const userData = await verifyAccessToken(token);
      req.users = userData;
    }
    next();
  } catch (err) {
    throw err;
  }
};

exports.isAuth = (req, _, next) => {
  try {
    if (req.users) {
      next();
    } else {
      throw errorWrapper([err]);
    }
  } catch (err) {
    next(err);
  }
};

exports.isAuthenticated = (req, _, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      throw errorWrapper([err]);
    }
  } catch (err) {
    next(err);
  }
};
