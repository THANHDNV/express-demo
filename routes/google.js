const express = require('express')
const router = express.Router();
const google = require('../controllers/google')

router.get('/', google.login);
router.get('/callback', google.callback)

module.exports = router