'use strict';

const Joi = require('../../lib/joi');

const ValidatorSchemaOfBody = Joi.object({
    num_intervention:Joi.string().required(),
    nom_client:Joi.string().required(),
    nature_intervention:Joi.string().required(),
    cadre_intervention:Joi.string().required(),
    msg_erreur:Joi.string().required(),
    prestation:Joi.string().required(),
    statut_intervention:Joi.string().required(),
    intervenant:Joi.string().required(),
    user_id:Joi.objectId().required(),
    machine_id:Joi.objectId().required()

});


module.exports = {
    ValidatorSchemaOfBody,
};