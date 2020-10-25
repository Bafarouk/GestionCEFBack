'use strict';
const mongoose = require('mongoose');
const Joi = require('../lib/joi');
const dateLib = require('../lib/date');
const { ObjectId } = require('mongoose').Types;
const {type_produits} = require("../constants");
const commonde = require("./commande");

const livraisonSchema =  mongoose.Schema({
    code_livraison:Number,
    date:Date,
    quantite:Number,
    type_produit:String,
    client:String,
    commande_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Commande',
    }
});

const joiLivraisonSchema = Joi.object({
    _id: Joi.objectId(),
    code_livraison:Joi.number().positive().required(),
    quantite:Joi.number().positive().required(),
    type_produit:Joi.valid(type_produits).required(),
    client:Joi.string().required(),
    date: Joi.date().default(() => dateLib.getDate(), 'time of creation'),
    commande_id:Joi.objectId().required()
});

function _validateSchema(livraison1) {
    return Joi.attempt(livraison1, joiLivraisonSchema);
}

function collection(){
    return mongoose.model('Livraison', livraisonSchema) ;
}

async function insertOne(livraison){
    const livraison_validate = _validateSchema(livraison);
    if(livraison_validate){
        const livraison_returned = await collection().insertMany(livraison_validate);
        const commonde_returned = await commonde.findOneById(ObjectId(livraison_returned[0].commande_id));
        if(commonde_returned){
            await commonde.IncOne(commonde_returned._id,{quantite_fournie:livraison_returned[0].quantite});
            await commonde.CheckAndUpdate(commonde_returned._id);
        }
        return livraison_returned ;
    }
    return null;
}

async function deleteById(code_livraison){

    const livraison_delete = await collection().find({code_livraison:code_livraison});
    if(livraison_delete) {
        await collection().deleteOne({id: livraison_delete._id});
        return true;
    }
    return false;

}


async function find(query = {}, projections = {}) {
    return await collection().find(query, projections);
}

async function findOneById(livraisonId, projections = {}) {
    return await collection().findOne({ _id: livraisonId }, projections);
}

async function findByCodeLivraison(code_livraison){
    return await  collection().find({code_livraison:code_livraison});
}


async function isValidPassword(user,password){
    const _returnedvalue = await collection().findOne({_id:user._id},{password:1,_id:0});
    return _returnedvalue.password === password ;
}

async function updateOne(code_livraison, updatedFields) {
    const result = await collection().updateOne(
        { code_livraison: code_livraison },
        { $set: updatedFields },
    );
    return result;
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
    findByCodeLivraison,
    findOneById,
    updateOne,
    isValidPassword,
    findOrCreateLocal,
    findOneByLogin
};