var express = require('express');
var router = express.Router();
let content = require("../controllers/content")
var multer = require('multer')
var upload = multer()

router.post('/sliderData', upload.single('image'), content.createSliderData);

router.put('/sliderData/:_id', upload.single('image'), content.updateSliderData);

router.delete('/sliderData/:_id', content.deleteSliderData);

router.get('/listSliderData', content.listSliderData);

router.get('/getQuestions/:categoryId', content.getQuestions);

router.get('/listAllQuestions', content.listAllQuestions);

router.post('/createQuestion', content.createQuestion);

router.post('/createQuestionCategory', content.createQuestionCategory);

router.get('/getQuestionCategory', content.getQuestionCategory);

router.put('/updateQuestionCategory/:categoryId', content.updateQuestionCategory);

router.delete('/deleteQuestionCategory/:categoryId', content.deleteQuestionCategory);

router.get('/listQuestionsByCategory/:categoryId', content.listQuestionsByCategory);

module.exports = router;
