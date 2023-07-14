const express = require('express')
const router = express.Router()
const DnsController = require('../Controllers/DNS.Controller')
// const checkTokenapi = require('../middlewares/checkTokenapi');

router.get('/mail', DnsController.check_mail_get)
router.post('/mail', DnsController.check_mail_post)

router.get('/url', DnsController.check_url)

module.exports = router
