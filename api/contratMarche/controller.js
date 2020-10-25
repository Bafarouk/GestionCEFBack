'use strict';

const contratMarches = require('../../models/contratMarche');
const schemaContratMarche = require('./schema').ValidatorSchemaOfBody ;
const Joi = require('../../lib/joi');


function _validateschemaCommande(body){
    return Joi.attempt(body,schemaContratMarche);

}


async function addContratMarche(req,res){
    const  contratMarche = await contratMarches.insertOne(req.body);
    if(contratMarche){
        return res.status(200).send(contratMarche);
    }
    return res.status(400).end();
}

async function findContratMarche(req,res){
    let contratMarcheID = req.query._id; // Get ["ID de ce contrat de marche"]
    const contratMarche=await contratMarches.findOneById(contratMarcheID);

    if(contratMarche){
        return res.status(200).send(contratMarche);
    }
    return res.status(404);

}

async function getAllContratMarches(req,res){
    const _contratMarches= await contratMarches.find({});
    if(_contratMarches){
        return res.status(200).send(_contratMarches);
    }
    return res.stat(404).end() ;
}


async function deleteContratMarche(req,res){
    let contratMarcheID = req.query._id; // Get ["ID de ce contrat de marche"]
    const contratMarche = await contratMarches.deleteById(contratMarcheID);
    if(contratMarche){
        return res.status(200).send();
    }
    return res.status(404).send();
}



module.exports = {
    addContratMarche,
    findContratMarche,
    deleteContratMarche,
    getAllContratMarches
};