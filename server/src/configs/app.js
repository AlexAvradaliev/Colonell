const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const router = require('../router/v1');
const { responseErrors } = require('../middlewares/responseErrors');

const app = express();

app.use(cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many Requests from this IP, please try again in an hour!'
});

app.use('/*', limiter);

app.use(mongosanitize());

app.use(xss());

app.use('/api/v1', router);
app.use(responseErrors());

module.exports = app;
