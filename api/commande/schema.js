'use strict';
const {type_produits} = require("../../constants");
const Joi = require('../../lib/joi');

const ValidatorSchemaOfBody = Joi.object({
    quantite:Joi.number().positive().required(),
    type_produit:Joi.valid(type_produits).required(),
    user_id:Joi.objectId().required()
});


module.exports = {
    ValidatorSchemaOfBody,
};