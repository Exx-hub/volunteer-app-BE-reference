var express = require('express');
var router = express.Router();
let file = require("../controllers/file")
var multer = require('multer')
var upload = multer()
var timeout = require('connect-timeout')

router.post('/', timeout('12000s'), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), file.createFile);

router.get('/', file.getFiles);

router.delete('/:_id', file.removeFile);

router.put('/:_id', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), file.updateFile);

module.exports = router;
