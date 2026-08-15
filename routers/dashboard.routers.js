const express = require('express')
const router = express.Router();

const authuser = require('../middleware/AuthUser.js')
const dashcont = require('../controllers/dashboard_controllers/dashboard.controller.js')
const SendNotification = require('../controllers/dashboard_controllers/SendNotify.js')
const Permissions = require('../middleware/Permission.js')

router.get('/data' , authuser , Permissions.AdminPermission ,dashcont.getDashboard);

router.get('/notifications' , authuser , SendNotification);
module.exports = router