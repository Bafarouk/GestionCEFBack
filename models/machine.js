'use strict';
const mongoose = require('mongoose');
const Joi = require('../lib/joi');
const dateLib = require('../lib/date');
const { ObjectId } = require('mongoose').Types;




const machineSchema =  mongoose.Schema({
    num_machine:String,
    type_machine:String,


});

const joiMachineSchema = Joi.object({
    _id: Joi.objectId(),
    num_machine:Joi.string().required(),
    type_machine:Joi.string().required(),

});

function _validateSchema(machine1) {
    return Joi.attempt(machine1, joiMachineSchema);
}

function collection(){
    return mongoose.model('Machine', machineSchema) ;
}

async function insertOne(machine) {
     const machine_validate = _validateSchema(machine);
    if(machine_validate){
    const machine_returned = await collection().insertMany(machine);
    return machine_returned;
    }
    return null;
}

async function deleteById(num_machine){

    const machine_delete = await collection().find({num_machine:num_machine});
    if(machine_delete) {
        await collection().deleteOne({id: machine_delete._id});
        return true;
    }
    return false;

}


async function find(query = {}, projections = {}) {
    return await collection().find(query, projections);
}

async function findOneById(machineId, projections = {}) {
    return await collection().findOne({ _id: machineId }, projections);
}

async function findByNumMachine(num_machine){
    return await  collection().find({num_machine:num_machine});


}


async function isValidPassword(user,password){
    const _returnedvalue = await collection().findOne({_id:user._id},{password:1,_id:0});
    return _returnedvalue.password === password ;
}

async function updateOne(num_machine, updatedFields) {
    const result = await collection().updateOne(
        { num_machine: num_machine },
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
    findByNumMachine,
    findOneById,
    updateOne,
    isValidPassword,
    findOrCreateLocal,
    findOneByLogin
};