const kakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/User');


module.exports = (passport)=>{
    passport.use(new kakaoStrategy({
        clientID: process.env.API_KEY,
        callbackURL: "http://localhost:5000/login/oauth"
    },
    async (accessToken,refreshToken,profile,done)=>{
        try{
        const exuser = await User.findOne({id:profile.id});
        if(exuser){
            done(null,exuser);
        }else{
            const newuser = await User.create({
                id: profile.id,
                gender:profile.has_gender,
                age:profile.age_range || null
            })
            done(null,newuser);
        }
        }catch(err){
            done(err);
        }
    }))
}