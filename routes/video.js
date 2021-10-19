var express = require('express');
var router = express.Router();
let videos = require("../controllers/video")
// let userValidator = require("../validators/user")
var multer = require('multer')
var upload = multer()
var timeout = require('connect-timeout')

router.post('/', timeout('12000s'), upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), videos.createVideo);

router.post('/video/:name', videos.video);

router.get('/', videos.getVideos);

router.delete('/:_id', videos.removeVideo);

router.put('/:_id', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), videos.updateVideo);

module.exports = router;