var express = require('express');
var router = express.Router();
let s3 = require("../controllers/s3")

router.get('/file/:fileName', s3.getFile);

module.exports = router;
