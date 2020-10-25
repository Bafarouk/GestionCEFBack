'use strict';

const Joi = require('../../lib/joi');
const {Roles}=require('../../Roles');

const ValidatorSchemaOfBody = Joi.object({
    nom :Joi.string().required(),
    prenom :Joi.string().required(),
    cin:Joi.string().min(8).required(),
    mail:Joi.string().email({minDomainAtoms: 2}).required(),
    password:Joi.string().min(8).required(),
    role:Joi.valid(Roles).default("utilisateur"),

});

const ValidatorForLogin = Joi.object({
    username:Joi.string().email().required(),
    password:Joi.string().required()
});

module.exports = {
    ValidatorSchemaOfBody,
    ValidatorForLogin
};