var express = require('express');
var router = express.Router();
let bulletinController = require("../controllers/bulletin")

router.post('/addBulletin', bulletinController.addBulletin);

router.put('/updateBulletin/:bulletinId', bulletinController.updateBulletin);

router.put('/deleteBulletin/:bulletinId', bulletinController.deleteBulletin);

router.get('/bulletinById/:bulletinId', bulletinController.bulletinById);

router.get('/nationwide', bulletinController.bulletinNationwide);

router.get('/regional', bulletinController.bulletinRegional);

router.get('/bulletinByRegionId/:regionId', bulletinController.bulletinByRegionId);

router.get('/', bulletinController.listBulletin);

router.get('/search', bulletinController.searchBulletin);

module.exports = router;
