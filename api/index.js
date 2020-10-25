'use strict';
const { Router } = require('express');

const userRoute = require('./user');

const commandeRoute = require('./commande');

const livraisonRoute = require('./livraison');

const machineRoute = require('./machine');

const interventionRoute = require('./intervention');

const contratMarcheRoute = require('./contratMarche');


module.exports = (app)=> {

    const router = Router();
    router.use('/user', userRoute);
    router.use('/commande',commandeRoute);
    router.use('/livraison',livraisonRoute);
    router.use('/machine',machineRoute);
    router.use('/intervention',interventionRoute);
    router.use('/contratMarche',contratMarcheRoute);
    app.use('/api', router);
};
