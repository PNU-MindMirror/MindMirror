const passport = require('passport');
const User = require('../models/User');
const kakao = require('./kakaoStrategy');
module.exports= ()=>{

    passport.serializeUser((user,done)=>{
        console.log('serialize',user);
        done(null,user.id);
    });

    passport.deserializeUser(async(id,done)=>{
        try{
            const user = await User.findById(id);
            done(null,user);
        }catch(err){
            done(err);
        }
    })
    kakao(passport);
}