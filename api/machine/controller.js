'use strict';

const machines = require('../../models/machine');
const schemaMachine = require('./schema').ValidatorSchemaOfBody ;
const Joi = require('../../lib/joi');


function _validateschemaMachine(body){
    return Joi.attempt(body,schemaMachine);

}


async function addMachine(req,res){
    const  machine = await machines.insertOne(req.body);
    if(machine){
        return res.status(200).send(machine);
    }
    return res.status(400).end();
}

async function getAllMachine(req,res){
    const _machines = await machines.find({});
    if(_machines){
        return res.status(200).send(_machines);
    }
    return res.stat(404).end() ;
}




async function findMachine(req,res){
    let num_machine = req.query.num_machine; // Get ["num serie de la machine"]
    const machine=await machines.findByNumMachine(num_machine);

    if(machine){
        return res.status(200).send(machine);
    }
    return res.status(404);

}

async function deleteMachine(req,res){
    let num_machine = req.query.num_machine; // Get ["num serie de la machine"]
    const machine=await machines.findByCodeLivraison(num_machine);
    if(machine){
        return res.status(200).send();
    }
    return res.status(404).send();
}



module.exports = {
    addMachine,
    findMachine,
    deleteMachine,
    getAllMachine,
};