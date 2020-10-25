'use strict';
const mongoose = require('mongoose');
const Joi = require('../lib/joi');
const dateLib = require('../lib/date');
const { ObjectId } = require('mongoose').Types;
const {type_produits} = require("../constants");
const {etat_commande} = require("../constants");

const commandeSchema =  mongoose.Schema({
    date:Date,
    quantite:Number,
    quantite_fournie:Number,
    type_produit:String,
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    etat:String
});

const joiCommandeSchema = Joi.object({
    _id: Joi.objectId(),
    quantite:Joi.number().positive().required(),
    quantite_fournie:Joi.number().positive(),
    type_produit:Joi.valid(type_produits).required(),
    date: Joi.date().default(() => dateLib.getDate(), 'time of creation'),
    user_id:Joi.objectId().required(),
    etat:Joi.valid(etat_commande).default("en cours")
});

function _validateSchema(commande1) {
    return Joi.attempt(commande1, joiCommandeSchema);
}

function collection(){
    return mongoose.model('Commande', commandeSchema) ;
}

async function insertOne(commande){
    const commande_validate = _validateSchema(commande);
    if(commande_validate){
        const commande_returned = await collection().insertMany(commande_validate);
        return commande_returned ;
    }
    return null;
}

async function deleteById(code_commande){

    const commande_delete = await collection().find({code_commande:code_commande});
    if(commande_delete) {
        await collection().deleteOne({id: commande_delete._id});
        return true;
    }
    return false;

}


async function find(query = {}, projections = {}) {
    return await collection().find(query, projections);
}

async function findOneById(commandeId, projections = {}) {
    return await collection().findOne({ _id: commandeId }, projections);
}


async function isValidPassword(user,password){
    const _returnedvalue = await collection().findOne({_id:user._id},{password:1,_id:0});
    return _returnedvalue.password === password ;
}

async function updateOne(id_commande, updatedFields) {
    const result = await collection().updateOne(
        { _id: id_commande },
        { $set: updatedFields },
    );
    return result;
}

async function ifFinished(id_commande){
    const commande_recived = await collection().findOne({_id:id_commande});
    if(commande_recived.quantite < commande_recived.quantite_fournie){
        return commande_recived ;
    }
    return null ;
}

async function CheckAndUpdate(id_commande){
    const commonde = await ifFinished(id_commande) ;
    if(commonde){
        await updateOne(id_commande,{etat:"finie"}) ;
    }
}

async function IncOne(userId, updatedFields) {
    const result = await collection().updateOne(
        { _id: userId },
        { $inc: updatedFields },
    );
    return result;
}
async function findOrCreateLocal(req){
    const {firstname,lastname,login,password} = req.body ;
    const foundUser = await collection().findOne({login:login});
    if(foundUser){
        return null ;
    }
    const newUser = await insertOne({
        firstname:firstname,
        lastname:lastname ,
        login:login,
        password:password
    });
    return newUser ;
}

async function findOneByLogin(userEmail){
    const user = await collection().findOne({login:userEmail});
    return user ;
}

module.exports = {
    insertOne,
    deleteById,
    find,
    findOneById,
    updateOne,
    isValidPassword,
    findOrCreateLocal,
    findOneByLogin,
    CheckAndUpdate,
    IncOne
};