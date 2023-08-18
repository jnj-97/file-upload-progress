const express=require('express');
const passport = require('passport');
const User = require('../controller/user.controller');
const router=express.Router();
router.post('/login',User.prototype.authenticate);
router.get('/profile',passport.authenticate('jwt',{session:false}),User.prototype.Profile);
module.exports=router;