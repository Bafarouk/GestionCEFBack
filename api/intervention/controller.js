'use strict';

const interventions = require('../../models/intervention');
const schemaIntervention = require('./schema').ValidatorSchemaOfBody ;
const Joi = require('../../lib/joi');


function _validateschemaCommande(body){
    return Joi.attempt(body,schemaIntervention);

}


async function addIntervention(req,res){
    const  intervention = await interventions.insertOne(req.body);
    if(intervention){
        return res.status(200).send(intervention);
    }
    return res.status(400).end();
}


async function getAllIntervention(req,res){
    const _interventions = await interventions.find({});
    if(_interventions){
        return res.status(200).send(_interventions);
    }
    return res.stat(404).end() ;
}


async function findIntervention(req,res){
    let num_intervention = req.query.num_intervention; // Get ["le numero de la machine"]
    const intervention=await interventions.findByNumIntervention(num_intervention);

    if(intervention){
        return res.status(200).send(intervention);
    }
    return res.status(404);

}

async function deleteIntervention(req,res){
    let num_intervention = req.query.num_intervention; // Get["le numero de la machine"]
    const intervention = await interventions.deleteById(num_intervention);
    if(intervention){
        return res.status(200).send();
    }
    return res.status(404).send();
}



module.exports = {
    addIntervention,
    findIntervention,
    deleteIntervention,
    getAllIntervention
};