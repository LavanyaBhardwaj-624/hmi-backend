
const express = require('express');

const router = express.Router();
const AuthUser = require('../middleware/AuthUser.js');
const sendUser = require('../controllers/Profilehandler/getProfile.js')


router.get('/getProfile' , AuthUser , sendUser );

module.exports = router;
