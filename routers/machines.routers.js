const express = require('express')
const router = express.Router();

const authuser = require('../middleware/AuthUser.js')
const mymachines = require('../controllers/dataControllers/getmachines.js')

const getdata = require('../controllers/dataControllers/getdata.js')
/**
 * /api/machines
 */

router.get('/details' , authuser , mymachines);

router.post('/data' , authuser , getdata)
module.exports = router