const express = require('express')
const router = express.Router();

const authuser = require('../middleware/AuthUser.js')
const dashcont = require('../controllers/dashboard_controllers/dashboard.controller.js')


router.get('/data' , authuser , dashcont.getDashboard);
module.exports = router