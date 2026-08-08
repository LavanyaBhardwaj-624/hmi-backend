const express = require('express')
const router = express.Router();

const authuser = require('../middleware/AuthUser.js');
const getalarms = require('../controllers/handleAlarms.contollers/getalarms.js')

const savealarms = require('../controllers/handleAlarms.contollers/savealarms.js')
router.get( '/data' , authuser, getalarms)

router.post('/save' , authuser , savealarms)

module.exports = router