var express = require('express');
var router = express.Router();
let videoBank = require("../controllers/videoBank")

router.post('/', videoBank.addToVideoBank);

router.get('/', videoBank.getVideoBank);

router.delete('/:_id', videoBank.deleteVideoBank);

module.exports = router;
