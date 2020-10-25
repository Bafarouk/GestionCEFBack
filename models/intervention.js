'use strict';
const mongoose = require('mongoose');
const Joi = require('../lib/joi');
const dateLib = require('../lib/date');
const { ObjectId } = require('mongoose').Types;



const interventionSchema =  mongoose.Schema({
    num_intervention:String,
    nom_client:String,
    nature_intervention:String,
    cadre_intervention:String,
    msg_erreur:String,
    prestation:String,
    statut_intervention:String,
    date:Date,
    intervenant:String,
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    machine_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Machine'
    }


});

const joiInterventionSchema = Joi.object({
    _id: Joi.objectId(),
    num_intervention:Joi.string().required(),
    nom_client:Joi.string().required(),
    nature_intervention:Joi.string().required(),
    cadre_intervention:Joi.string().required(),
    msg_erreur:Joi.string().required(),
    prestation:Joi.string().required(),
    statut_intervention:Joi.string().required(),
    date: Joi.date().default(() => dateLib.getDate(), 'time of creation'),
    intervenant:Joi.string().required(),
    user_id:Joi.objectId().required(),
    machine_id:Joi.objectId().required(),



});
function _validateSchema(intervention1) {
    return Joi.attempt(intervention1, joiInterventionSchema);
}

function collection(){
    return mongoose.model('Intervention', interventionSchema) ;
}


async function insertOne(intervention) {
    const intervention_validate = _validateSchema(intervention);
    if(intervention_validate){
        const intervention_returned = await collection().insertMany(intervention);
        return intervention_returned;
    }
    return null;
}

async function deleteById(num_intervention){

    const intervention_delete = await collection().find({num_intervention:num_intervention});
    if(intervention_delete) {
        await collection().deleteOne({id: intervention_delete._id});
        return true;
    }
    return false;

}


async function find(query = {}, projections = {}) {
    return await collection().find(query, projections);
}

async function findOneById(interventionId, projections = {}) {
    return await collection().findOne({ _id: interventionId }, projections);
}

async function findByNumIntervention(num_intervention){
    return await  collection().find({num_intervention:num_intervention});
}

async function updateOne(num_intervention, updatedFields) {
    const result = await collection().updateOne(
        { num_intervention: num_intervention },
        { $set: updatedFields },
    );
    return result;
}





    module.exports = {
        insertOne,
        deleteById,
        find,
        findByNumIntervention,
        findOneById,
        updateOne,
    };