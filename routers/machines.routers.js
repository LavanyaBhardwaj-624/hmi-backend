const express = require('express')
const router = express.Router();

const authuser = require('../middleware/AuthUser.js')
const mymachines = require('../controllers/dataControllers/getmachines.js')
const Op_machines = require('../controllers/OperatorPage/LandingPage.js')
const getdata = require('../controllers/dataControllers/getdata.js')
/**
 * /api/machines
 */
const ratelimiter = require('../middleware/rateLimiter.js');
const Permissions = require('../middleware/Permission.js')

router.get('/details' , authuser , Permissions.AdminPermission , mymachines);

router.post('/data' , authuser , getdata)

router.get('/OperatorPage' , authuser ,Permissions.OperatorPermission, Op_machines);
module.exports = router