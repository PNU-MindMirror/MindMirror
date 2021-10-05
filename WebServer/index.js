const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');
const PORT = process.env.PORT || 5000;
const passportConfig = require('../passport/index');
const authRouter = require('../routers/auth');
const postRouter = require('../routers/post');
const detailRouter = require('../routers/detail');
dotenv.config();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
// app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    name:'session_id',
    secret: process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();
app.use(express.static('static'));

app.get('/',(req,res)=>{
    return res.render('main')
})



app.use('/login',authRouter);
app.use('/main',postRouter);
app.use('/detail',detailRouter);

mongoose.connect(process.env.MONGO_URI,(err)=>{
    if(err)console.log(err);
    else{
        console.log('MONGODB CONNECTED')
    }
})

app.listen(PORT,(err)=>{
    if(err){
        console.err(err);
    }
    console.log(`server is listen on ${PORT}`)
})