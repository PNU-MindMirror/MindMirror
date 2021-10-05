const express = require('express');
const { isLoggedin,isNotLoggedin } = require('../middleware/auth');
const authRouter = express.Router();
const passport = require('passport');


authRouter.get('/kakao',isNotLoggedin,passport.authenticate('kakao',{
    failureRedirect:'/'
}));

authRouter.get('/oauth',passport.authenticate('kakao',{
    failureRedirect:'/'
}),(req,res)=>{
    res.redirect('http://localhost:5000/main/lobby');
})

module.exports = authRouter;