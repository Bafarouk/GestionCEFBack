const express = require('express');
const router=  express.Router();
const controller = require('./controller');
const wrap = require('co-express');


router.post('/addLivraison',wrap(controller.addLivraison));
router.get('/findlIvraison',wrap(controller.findLivraison));
router.delete('/deleteLivraison',wrap(controller.deleteLivraison));
router.get('/getAll',wrap(controller.getAllLivraison));

module.exports = router ;
