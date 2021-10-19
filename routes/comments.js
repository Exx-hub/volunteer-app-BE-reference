var express = require('express');
var router = express.Router();
let comments = require("../controllers/comments")

router.post('/save', comments.saveComment);

router.get('/get/:courseId', comments.getComment);

module.exports = router;
