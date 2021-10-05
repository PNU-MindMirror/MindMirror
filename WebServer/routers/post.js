const express = require('express');
const { isLoggedin } = require('../middleware/auth');
const postRouter = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const requests = require('request');
const { json } = require('express');

postRouter.get('/lobby',isLoggedin,async (req,res)=>{
    const allPost = await Post.find({author:req.user});
    res.render('lobby',{allPost});
})
postRouter.get('/calendar',(req,res)=>{
    res.render('calendar');
})
postRouter.get('/post',async (req,res)=>{
    const DC = new Date();
    const date = `${DC.getFullYear()}년 ${DC.getMonth()+1}월 ${DC.getDate()}일`;
    // const didwrite = await Post.find({$and:[{"author":req.user},{"date.day":`${DC.getDate()}`},{"date.month":`${DC.getMonth()+1}`},{"date.year":`${DC.getFullYear()}`}]})
    // if(didwrite.length != 0){
    //     //오늘 글 썻으면 로비로 리다이렉트
    //     console.log(didwrite);
    //     res.redirect('/main/lobby')
    // }
    // else{
        res.render('post',{date});
    // }
})
postRouter.post('/post',(req,response)=>{
    const {post} = req.body;
    const DC = new Date();
    const year = `${DC.getFullYear()}`;
    const month = `${DC.getMonth()+1}`;
    const day = `${DC.getDate()}`;
    requests.post({
        uri: 'http://localhost:8000/api',//파이썬 모델로 요청
        body: {"content": post},
        json:true
    },async function(err,res,body){
        console.log(res.body);
        if(err){
            console.error(err)
        }
        else{
        data = JSON.stringify(res.body);
        jsondata = JSON.parse(data);
        emotion = JSON.stringify(jsondata.emotion);
        sentence = JSON.stringify(jsondata.sentence);
        situation = JSON.stringify(jsondata.situation)
        await Post.create({
            author: req.user.id,
            body: post,
            date:{
                year:year,
                month:month,
                day:day
            },
            emotion: emotion,
            sentence: sentence,
            situation: situation,
        })
        response.redirect(`http://localhost:5000/detail?year=${DC.getFullYear()}&month=${DC.getMonth()+1}&day=${DC.getDate()}`);
    }});
})// 게시글 작성=> 게시글 db저장 => 파이썬 모델에 json데이터 전송=>결과 반환=> 반환된 결과와 함께 페이지 렌더링
module.exports = postRouter;


//미들웨어에서 저장하는 메소드 만들고 거기서 저장후 다음으로 넘겨서 requests요청 보내면 ㅕ되지않을까?