var express = require('express');
var router = express.Router();
let regionController = require("../controllers/region")

router.post('/addRegion', regionController.addRegion);

router.put('/updateRegion/:regionId', regionController.updateRegion);

router.put('/deleteRegion/:regionId', regionController.deleteRegion);

router.get('/regionById/:regionId', regionController.regionById);

router.get('/', regionController.listRegions);

module.exports = router;
