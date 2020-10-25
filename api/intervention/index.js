const express = require('express');
const router=  express.Router();
const controller = require('./controller');
const wrap = require('co-express');

router.post('/addIntervention',wrap(controller.addIntervention));
router.get('/findIntervention',wrap(controller.findIntervention));
router.delete('/deleteIntervention',wrap(controller.deleteIntervention));
router.get('/getAllIntervention',wrap(controller.getAllIntervention));


module.exports = router ;