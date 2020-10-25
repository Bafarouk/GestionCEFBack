const express = require('express');
const router=  express.Router();
const controller = require('./controller');
const wrap = require('co-express');




router.post('/addCommande',wrap(controller.addCommande));
router.get('/findCommande',wrap(controller.findCommande));
router.delete('/deleteCommande',wrap(controller.deleteCommande));
router.get('/getAllCommande',wrap(controller.getAllCommande));

module.exports = router ;
