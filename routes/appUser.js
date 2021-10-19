var express = require('express');
var router = express.Router();
let userController = require("../controllers/appUser")

router.post('/addUser', userController.addUser);

router.post('/login', userController.login);

router.put('/updateUser/:userId', userController.updateUser);

router.put('/deleteUser/:userId', userController.deleteUser);

router.get('/userById/:userId', userController.userById);

router.get('/', userController.listUsers);

module.exports = router;
