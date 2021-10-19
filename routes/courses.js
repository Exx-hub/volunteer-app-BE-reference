var express = require('express');
var router = express.Router();
let courses = require("../controllers/courses")
var multer = require('multer')
var upload = multer()

router.post('/', upload.single('image'), courses.createCourse);

router.get('/', courses.getCoursestest);

router.get('/temp/test', courses.getCoursestest);

router.get('/courseData/:courseId', courses.courseDataTempTest);

router.get('/courseData/temp/test/:courseId', courses.courseDataTempTest);

router.put('/:courseId', upload.single('image'), courses.updateCourse);

router.delete('/:courseId', courses.deleteCourse);

module.exports = router;
