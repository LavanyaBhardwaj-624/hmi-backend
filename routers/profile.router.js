
const express = require('express');

const router = express.Router();
const AuthUser = require('../middleware/AuthUser.js');
const sendUser = require('../controllers/Profilehandler/getProfile.js')
const PasswordMethods = require('../controllers/Profilehandler/ConfirmPass.js');
const OperatorMethod = require('../controllers/Profilehandler/OperatorEdit.js');
const AdminEdit = require('../controllers/Profilehandler/adminEdits.js')
const ResponseRouter = require('../controllers/Profilehandler/Accept&Reject.js')
const ratelimiter = require('../middleware/rateLimiter.js');
const Permissions = require('../middleware/Permission.js')

router.get('/getProfile' , AuthUser , sendUser );

router.post('/confirmPass' , AuthUser , ratelimiter, PasswordMethods.ConfirmPass);
router.post('/changePass' , AuthUser, ratelimiter , PasswordMethods.SetPass);

router.post('/UpdateOperator' , AuthUser, ratelimiter , Permissions.OperatorPermission , OperatorMethod.UpdateUser);
router.post('/RequestChange' , AuthUser , ratelimiter , Permissions.OperatorPermission ,OperatorMethod.UpdateCompany);

router.post('/AdminEdit' , AuthUser , ratelimiter , Permissions.AdminPermission ,AdminEdit);

router.post('/accept' , AuthUser , ratelimiter ,Permissions.AdminPermission, ResponseRouter.Accept);
router.post('/reject' , AuthUser , ratelimiter , Permissions.AdminPermission ,ResponseRouter.Reject);

module.exports = router;
