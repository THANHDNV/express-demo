const express = require('express')
const router = express.Router()
const fb = require('../controllers/fb')

router.get('/', fb.login)
router.get('/callback', fb.callback)

module.exports = router