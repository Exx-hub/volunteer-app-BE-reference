var express = require('express');
var router = express.Router();
let aboutController = require("../controllers/about")

router.post('/addAbout', aboutController.addAbout);

router.put('/updateAbout/:aboutId', aboutController.updateAbout);

router.put('/deleteAbout/:aboutId', aboutController.deleteAbout);

router.get('/aboutById/:aboutId', aboutController.aboutById);

router.get('/', aboutController.listAbout);

module.exports = router;
