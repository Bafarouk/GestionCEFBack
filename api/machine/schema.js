'use strict';

const Joi = require('../../lib/joi');

const ValidatorSchemaOfBody = Joi.object({
    num_machine:Joi.string().required(),
    type_machine:Joi.string().required(),
});


module.exports = {
    ValidatorSchemaOfBody,
};