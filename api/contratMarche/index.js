const express = require('express');
const router=  express.Router();
const controller = require('./controller');
const wrap = require('co-express');




router.post('/addContratMarche',wrap(controller.addContratMarche));
router.get('/findContratMarche',wrap(controller.findContratMarche));
router.delete('/deleteContratMarche',wrap(controller.deleteContratMarche));
router.get('/getAllContratMarches',wrap(controller.getAllContratMarches));

module.exports = router ;
