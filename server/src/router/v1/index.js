const router = require('express').Router();

const localAuth = require('./authRoutes');
const socialRoutes = require('./socialRoutes');

router.use('/', socialRoutes);
router.use('/auth', localAuth);

module.exports = router;
