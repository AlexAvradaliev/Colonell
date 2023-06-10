const router = require('express').Router();

const { auth } = require('../../middlewares/guards');
const localAuth = require('./authRoutes');


router.use(auth())
router.use('/auth', localAuth);

module.exports = router;
