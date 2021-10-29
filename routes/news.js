var express = require('express');
var router = express.Router();
let newsController = require("../controllers/news")

router.post('/addNews', newsController.addNews);

router.put('/updateNews/:newsId', newsController.updateNews);

router.put('/deleteNews/:newsId', newsController.deleteNews);

router.get('/newsById/:newsId', newsController.newsById);

router.get('/newsByRegionId/:regionId', newsController.newsByRegionId);

router.get('/newsByMunicipalityId/:municipalityId', newsController.newsByMunicipalityId);

router.get('/', newsController.listNews);

router.get('/search', newsController.searchNews);

module.exports = router;
