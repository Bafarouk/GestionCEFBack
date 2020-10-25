'use strict';

const livraisons = require('../../models/livraison');
const schemaCommande = require('./schema').ValidatorSchemaOfBody ;
const Joi = require('../../lib/joi');


function _validateschemaCommande(body){
    return Joi.attempt(body,schemaCommande);

}


async function addLivraison(req,res){
    const  livraison = await livraisons.insertOne(req.body);
    if(livraison){
        return res.status(200).send(livraison);
    }
    return res.status(400).end();
}

async function findLivraison(req,res){
    let code_Livraison = req.query.code_livraison; // Get ["code de la livraison"]
    const livraison=await livraisons.findByCodeLivraison(code_Livraison);

    if(livraison){
        return res.status(200).send(livraison);
    }
    return res.status(404);

}

async function getAllLivraison(req,res){
    const _livraisons = await livraisons.find({});
    if(_livraisons){
        return res.status(200).send(_livraisons);
    }
    return res.stat(404).end() ;
}

async function deleteLivraison(req,res){
    let code_livraison = req.query.code_commande; // Get["code de la livraison"]
    const livraison = await livraisons.deleteById(code_livraison);
    if(livraison){
        return res.status(200).send();
    }
    return res.status(404).send();
}



module.exports = {
    addLivraison,
    findLivraison,
    deleteLivraison,
    getAllLivraison
};