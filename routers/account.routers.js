const express = require('express')
const router = express.Router();
const validate = require('../middleware/user.validate.js');
const authuser = require('../middleware/AuthUser.js');
const Account = require('../controllers/authcontrollers.js/account.controller.js');
const steps = require('../controllers/authcontrollers.js/steps.controller.js')
const ratelimmiter = require('../middleware/rateLimiter.js');
const ratelimiter = require('../middleware/rateLimiter.js');
/**
 * /api/auth/register
 * /api/auth/login
 */
router.post('/registerAdmin',ratelimiter, validate , Account.CreateAdmin);

router.post('/registerOperator',ratelimiter, validate , Account.CreateOperator);

router.post('/login' ,ratelimiter, Account.Login);

router.post('/CreateCompany' , authuser, steps.CreateCompany );

router.post('/AddMachines' , authuser , steps.AddMachineType , steps.AddMachines);

router.post('/logout' , Account.Logout)

module.exports = router