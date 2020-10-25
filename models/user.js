'use strict';
const mongoose = require('mongoose');
const Joi = require('../lib/joi');
const dateLib = require('../lib/date');
const { ObjectId } = require('mongoose').Types;
const {Roles}=require('../Roles');

const userSchema =  mongoose.Schema({
    nom:String,
    prenom:String,
    cin:String,
    mail:String,
    password:String,
    role:String,
});

const joiUserSchema = Joi.object({
    _id: Joi.objectId(),
    nom:Joi.string().required(),
    prenom:Joi.string().required(),
    cin:Joi.string().min(8).required(),
    mail:Joi.string().email({minDomainAtoms: 2}).required(),
    password:Joi.string().min(8).required(),
    role:Joi.valid(Roles).default("utilisateur"),
    });

function _validateSchema(user1) {
    return Joi.attempt(user1, joiUserSchema);
}

function collection(){
    return mongoose.model('User', userSchema) ;
}

async function insertOne(user){
    const user_validate = _validateSchema(user);
    if(user_validate){
        const user_returned = await collection().insertMany(user_validate);
        return user_returned ;
    }
    return null;
}

async function deleteById(id){
    id = mongoose.Types.ObjectId(id);
    const user_delete= await collection().find({id:id});
    if(user_delete) {
        await collection().deleteOne({id: user_delete._id});
        return true;
    }
    return false;

}


function find(query = {}, projections = {}) {
    return collection().find(query, projections);
}

function findOneById(userId, projections = {}) {
    return collection().findOne({ _id: userId }, projections);
}

async function findByCin(mail){
        return await  collection().find({mail:mail});


}


async function isValidPassword(user,password){
    const _returnedvalue = await collection().findOne({_id:user._id},{password:1,_id:0});
    return _returnedvalue.password === password ;
}

async function updateOne(userId, updatedFields) {
    console.log(updatedFields)
    const result = await collection().updateOne(
        { _id: userId },
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
    const {prenom,nom,mail,cin,password} = req.body ;
    const foundUser = await collection().findOne({mail:mail});
    if(foundUser){
        return null ;
    }
    const newUser = await insertOne({
        prenom:prenom,
        nom:nom ,
        mail:mail,
        password:password,
        cin:cin
    });
    return newUser ;
}

async function findOneByLogin(userEmail){
    const user = await collection().findOne({mail:userEmail});
    return user ;
}

module.exports = {
    insertOne,
    deleteById,
    find,
    findByCin,
    findOneById,
    updateOne,
    isValidPassword,
    findOrCreateLocal,
    findOneByLogin
};