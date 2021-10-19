var express = require('express');
var router = express.Router();
let userController = require("../controllers/user")
var multer = require('multer')
var upload = multer()

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/socialLogin', userController.socialLogin);

router.put('/updateProfile/:userId', upload.single('avtar'), userController.updateProfile);

router.get('/userProfileById/:userId', userController.userProfileById);

router.post('/payment', userController.payment);

router.get('/', userController.listUsers);

module.exports = router;
