'use strict';

const HttpStatus = require('http-status-codes');
const logger = require('chpr-logger');
const users = require('../../models/user');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('./configuration');
const schemaSignUp = require('./schema').ValidatorSchemaOfBody ;
const schemaSignIn = require('./schema').ValidatorForLogin ;
const Joi = require('../../lib/joi');
const nodemailer = require('nodemailer');

function _validateSchemaSignUp(body){
    return Joi.attempt(body,schemaSignUp);
}

function _validateSchemaLogin(body){
    return Joi.attempt(body,schemaSignIn);
}

let signToken = user => {
    return JWT.sign({
        iss: 'CodeWorkr',
        sub: user._id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, JWT_SECRET);
};

async function add(req,res){
    logger.info(req.body);
    const user = await users.insertOne(req.body) ;
    // console.log(req.body.mail)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mohamedfarouk.benakacha@etudiant-fst.utm.tn',
            pass: '12345678'
        }
    });

    var mailOptions = {
        from: 'mohamedfarouk.benakacha@etudiant-fst.utm.tn',
        to: req.body.mail,
        subject: 'Bienvenu ! ',
        text: "Bienvenu chez l'application de gestion de centre d'édition de la STEG ! votre mot de passe par défaut est : "+req.body.password
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("error");
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    if(user){
        return res.status(200).send(user);
    }
    return res.status(400).end();
}

async function getAllUser(req,res){
    const _users = await users.find({});
    if(_users){
        return res.status(200).send(_users);
    }
    return res.stat(404).end() ;
}

async function modifier(req,res){
    let id = req.body._id; // Get["id"]
    const user = await users.updateOne(id , req.body);
    if(user){
        return res.status(200).send();
    }
    return res.status(404).send();
}


async function deleteUser(req,res){
    let id = req.query.id; // Get["id"]
    const user = await users.deleteById(id);
    if(user){
        return res.status(200).send();
    }
    return res.status(404).send();
}

async function findUser(req,res){
    let mail = req.query.mail; // Get ["cin"]

    const user=await users.findByCin(mail);

    if(user){
        return res.status(200).send(user);
    }
    return res.status(404);
}

function secret(req,res,next){
    res.json(req.user);
}

async function signUp(req,res,next){
    req.body = _validateSchemaSignUp(req.body) ;
    if(req.body){
        const user = await users.findOrCreateLocal(req);
        if(!user){
            return res.status(403).json({error:"User already exist!"});
        }
        const token = signToken(user[0]);
        res.status(200).json({ token });
    }
    res.status(500).end();
}

async function signIn(req,res){
    req.body = _validateSchemaLogin(req.body);
    console.log("req :",req);
    if(req){
        const token = signToken(req.user);
        return res.status(200).json({ token });
    }
    return res.status(405).end();
}


module.exports = {
    add,
    deleteUser,
    findUser,
    secret,
    signIn,
    signUp,
    getAllUser,
    modifier
};