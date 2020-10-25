const express = require('express');
const wrap = require('co-express');
const passport = require('passport') ;
const controller = require('./controller');
const passportJWTConf = require('../../passport/jwt-passport');
const passportLOCALConf = require('../../passport/local-passport');
const router=  express.Router();
const passportJWT = passport.authenticate('jwt', { session: false });
const passportSignIn = passport.authenticate('local', { session: false });

router.post('/signup',wrap(controller.signUp));
router.post('/signin',passportSignIn, controller.signIn);
router.post('/add',wrap(controller.add));
router.delete('/deleteUser',wrap(controller.deleteUser));
router.get('/findUser',wrap((controller.findUser)));
router.get('/secret',passportJWT,controller.secret);
router.get('/getAllUser',wrap(controller.getAllUser));
router.post('/modifier',wrap(controller.modifier));

module.exports = router ;