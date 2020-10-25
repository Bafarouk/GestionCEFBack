'use strict';
const mongoose = require('mongoose');
const Joi = require('../lib/joi');
const dateLib = require('../lib/date');
const { ObjectId } = require('mongoose').Types;
const {etat_commande} = require("../constants");



const ContratMarcheSchema =  mongoose.Schema({
    date_debut:Date,
    date_fin:Date,
    prestation:String,
    etat:String,
    fournisseur:String,



});

const joiContratMarcheSchema = Joi.object({
    _id: Joi.objectId(),
    prestation:Joi.string().required(),
    etat:Joi.valid(etat_commande).default("en cours"),
    fournisseur:Joi.string().required()



});
function _validateSchema(contratMarche1) {
    return Joi.attempt(contratMarche1, joiContratMarcheSchema);
}

function collection(){
    return mongoose.model('ContratMarche', ContratMarcheSchema) ;
}


async function insertOne(contratMarche) {
    const contratMarche_validate = _validateSchema(contratMarche);
    if(contratMarche_validate){
        const contratMarche_returned = await collection().insertMany(contratMarche);
        return contratMarche_returned;
    }
    return null;
}

async function deleteById(contratMarcheId){

    const contratMarche_delete = await collection().find({_id:contratMarcheId});
    if(contratMarche_delete) {
        await collection().deleteOne({id: contratMarche_delete._id});
        return true;
    }
    return false;

}


async function find(query = {}, projections = {}) {
    return await collection().find(query, projections);
}

async function findOneById(contratMarcheId, projections = {}) {
    return await collection().findOne({ _id: contratMarcheId }, projections);
}

async function findByFournisseur(fournisseur){
    return await  collection().find({fournisseur:fournisseur});
}

async function updateOne(contratMarcheId, updatedFields) {
    const result = await collection().updateOne(
        { _id: contratMarcheId },
        { $set: updatedFields },
    );
    return result;
}





module.exports = {
    insertOne,
    deleteById,
    find,
    findByFournisseur,
    findOneById,
    updateOne,
};