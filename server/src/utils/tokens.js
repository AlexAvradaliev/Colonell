const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const redisClient = require('../configs/redis');
const { mathTimeToken } = require('./otp');
const { errorWrapper } = require('./errorWrapper');

const jwtVerify = promisify(jwt.verify);
const jwtSign = promisify(jwt.sign);

const err = {
  status: 401,
  message: 'Invalid token!',
  param: 'token'
};

exports.createAccessToken = async (_id) => {
  try {
    return await jwtSign({ _id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.createRefreshToken = async (_id) => {
  try {
    const token = await jwtSign({ exp: Math.floor(Date.now() / 1000) + mathTimeToken(process.env.JWT_REFRESH_TIME), _id }, process.env.JWT_REFRESH_SECRET);
    redisClient.SET(_id.toString(), token, 'EX', mathTimeToken(process.env.JWT_REFRESH_TIME), (error, _) => {
      if (error) {
        throw err;
      }
    });
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.verifyAccessToken = async (token) => {
  try {
    const decoded = await jwtVerify(token, process.env.JWT_ACCESS_SECRET);
    return decoded;
  } catch (error) {
    throw errorWrapper([err]);
  }
};

exports.verifyRefreshToken = async (token) => {
  if (!token) {
    throw err;
  }
  try {
    const decoded = await jwtVerify(token, process.env.JWT_REFRESH_SECRET);

    const memToken = await redisClient.GET(decoded._id.toString());
    if (memToken !== token) {
      throw err;
    }
    return decoded;
  } catch (error) {
    throw errorWrapper([err]);
  }
};

exports.removeRefreshToken = async (id) => {
  try {
    if (!id) {
      return;
    }
    redisClient.DEL(id.toString());
    return;
  } catch (err) {
    return;
  }
};
