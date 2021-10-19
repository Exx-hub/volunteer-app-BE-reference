
var express = require('express');
var router = express.Router();
let trainerController = require("../controllers/trainer")
// let trainerValidator = require("../validators/trainer")
var multer = require('multer')
var upload = multer()

router.post('/', upload.single('avtar'), trainerController.createTrainer);

router.get('/', trainerController.getTrainers);

router.put('/:trainerId', upload.single('avtar'), trainerController.updateTrainer);

router.delete('/:trainerId', trainerController.deleteTrainer);

module.exports = router;
