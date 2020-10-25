'use strict';

const commandes = require('../../models/commande');
const schemaCommande = require('./schema').ValidatorSchemaOfBody ;
const Joi = require('../../lib/joi');


function _validateschemaCommande(body){
    return Joi.attempt(body,schemaCommande);

}


async function addCommande(req,res){
    const  commande = await commandes.insertOne(req.body);
    if(commande){
        return res.status(200).send(commande);
    }
    return res.status(400).end();
}

async function findCommande(req,res){
    let code_commande = req.query.code_commande; // Get ["code commande"]
    const commande=await commandes.findByCodeCommande(code_commande);

    if(commande){
        return res.status(200).send(commande);
    }
    return res.status(404);

}

async function getAllCommande(req,res){
    const _commandes = await commandes.find({});
    if(_commandes){
        return res.status(200).send(_commandes);
    }
    return res.stat(404).end() ;
}


async function deleteCommande(req,res){
    let code_commande = req.query.code_commande; // Get["code_commande"]
    const commande = await commandes.deleteById(code_commande);
    if(commande){
        return res.status(200).send();
    }
    return res.status(404).send();
}



module.exports = {
    addCommande,
    findCommande,
    deleteCommande,
    getAllCommande
};