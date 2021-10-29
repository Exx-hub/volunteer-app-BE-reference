var express = require('express');
var router = express.Router();
let userController = require("../controllers/user")

router.post('/createUser', userController.createUser);

router.post('/signup/request-otp', userController.signupRequestOTP);

router.post('/signup/verify-otp', userController.signupVerifyOTP);

router.post('/login', userController.login);

router.put('/updateUser/:userId', userController.updateUser);

router.put('/deleteUser/:userId', userController.deleteUser);

router.get('/userById/:userId', userController.userById);

router.get('/', userController.listUsers);

router.get('/search', userController.searchUser);

router.post('/forgot-password/request-otp', userController.forgotPassRequestOTP);

router.post('/forgot-password/verify-otp', userController.forgotPassVerifyOTP);

module.exports = router;
