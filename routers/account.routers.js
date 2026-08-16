const express = require('express')
const router = express.Router();
const validate = require('../middleware/user.validate.js');
const authuser = require('../middleware/AuthUser.js');
const Account = require('../controllers/authcontrollers.js/account.controller.js');
const steps = require('../controllers/authcontrollers.js/steps.controller.js')

const ratelimiter = require('../middleware/rateLimiter.js');
const Permissions = require('../middleware/Permission.js')
/**
 * /api/auth/register
 * /api/auth/login
 */
router.post('/registerAdmin',ratelimiter, validate , Account.CreateAdmin);

router.post('/registerOperator',ratelimiter, validate , Account.CreateOperator);

router.post('/login' ,ratelimiter, Account.Login);

router.post('/CreateCompany' , authuser, Permissions.AdminPermission, steps.CreateCompany );

router.post('/AddMachines' , authuser , Permissions.AdminPermission ,steps.AddMachineType , steps.AddMachines);

router.post('/logout' , Account.Logout)

module.exports = router