var express = require('express');
var router = express.Router();
let municipalityController = require("../controllers/municipality")

router.post('/addMunicipality', municipalityController.addMunicipality);

router.put('/updateMunicipality/:municipalityId', municipalityController.updateMunicipality);

router.put('/deleteMunicipality/:municipalityId', municipalityController.deleteMunicipality);

router.get('/municipalityById/:municipalityId', municipalityController.municipalityById);

router.get('/', municipalityController.listMunicipality);

router.get('/:regionId', municipalityController.municipalityByRegionId);

module.exports = router;
