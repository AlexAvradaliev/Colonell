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

exports.isAuthenticated = async (req, res, next) => {
  try {
    const user = req.session.passport.user;
    res.clearCookie(req.headers['cookie'].split('=')[0]);
    if (user) {
      req.users = user;
      next();
    } else {
      throw errorWrapper([err]);
    }
  } catch (err) {
    next(err);
  }
};
