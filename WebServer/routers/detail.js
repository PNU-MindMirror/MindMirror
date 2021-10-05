const { json } = require('express');
const express = require('express');
const { isLoggedin } = require('../middleware/auth');
const detailRouter = express.Router();
const Post = require('../models/Post');

detailRouter.get('',isLoggedin,async (req,res)=>{
    const {year,month,day} = req.query;
    const date = new Date();
    const post = await Post.find({$and:[{"author":req.user},{"date.year":year},{"date.month":month},{"date.day":day}]});
    if(post.length == 0){
        res.render('error/notfound');
    }else{
        console.log(post)
        const emotion = post[0].emotion
        const sentence = post[0].sentence
        const jsonsentence = JSON.parse(sentence)
        const situation = post[0].situation;
        const jsonsituation = JSON.parse(situation);
        const jsonemotion = JSON.parse(emotion)
        const maxemotion = Object.keys(jsonsituation);
        res.render('detailpage/daily',{jsonemotion,jsonsentence,situation,maxemotion})
    }
})

detailRouter.get('/week',async (req,res)=>{
    const {feeling} = req.query;
    const post = await Post.find({"author":req.user}).sort({createdAt:-1}).limit(7);
    let jsonpost = JSON.parse(JSON.stringify(post));
    //해당 달 감정별 퍼센트 다 더하기
    let resultarr = {'분노':0,'슬픔':0,'불안':0,'상처':0,'당황':0,'기쁨':0,'중립':0}
    //감정별 퍼센트 리스트
    let anger = [];
    let sad = [];
    let unrest = [];
    let scar = [];
    let embarrass =[];
    let happy = [];
    let neutral = [];
    for(let i=0; i<post.length; i++){
        jsonpost[i].emotion = JSON.parse(jsonpost[i].emotion)
        resultarr.분노 += jsonpost[i].emotion.분노
        anger.push(jsonpost[i].emotion.분노)
        resultarr.슬픔 += jsonpost[i].emotion.슬픔
        sad.push(jsonpost[i].emotion.슬픔)
        resultarr.불안 += jsonpost[i].emotion.불안
        unrest.push(jsonpost[i].emotion.불안)
        resultarr.상처 += jsonpost[i].emotion.상처
        scar.push(jsonpost[i].emotion.불안)
        resultarr.당황 += jsonpost[i].emotion.당황
        embarrass.push(jsonpost[i].emotion.당황)
        resultarr.기쁨 += jsonpost[i].emotion.기쁨
        happy.push(jsonpost[i].emotion.기쁨)
        resultarr.중립 += jsonpost[i].emotion.중립
        neutral.push(jsonpost[i].emotion.중립)

    }
    let jsonsituationarr = [];
    for(let i=0; i<jsonpost.length; i++){
        jsonsituationarr.push(JSON.parse(jsonpost[i].situation));
    }
    let situationanger = [];
    let situationsad= [];
    let situationhappy = [];
    let situationscar = [];
    let situationemberrass = [];
    let situationunrest = [];
    let situationneutral = [];
    for(let i=0; i<jsonsituationarr.length; i++){
        if(Object.keys(jsonsituationarr[i])=="분노"){
            situationanger.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="슬픔"){
            situationsad.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="기쁨"){
            situationhappy.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="불안"){
            situationunrest.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="당황"){
            situationemberrass.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="상처"){
            situationscar.push(Object.values(jsonsituationarr[i])[0])
        }else{
            situationneutral.push(Object.values(jsonsituationarr[i])[0])
        }
    }
    let returnanger = [];
    let returnhappy = [];
    let returnsad = [];
    let returnscar = [];
    let returnembarrass = [];
    let returnunrest = [];
    let returnneutral = [];
    //분노 상황
    returnanger.push(situationanger.filter(x => x=="가족관계").length)
    returnanger.push(situationanger.filter(x => x=="학업 및 진로").length)
    returnanger.push(situationanger.filter(x => x=="학교폭력/따돌림").length)
    returnanger.push(situationanger.filter(x => x=="대인관계").length)
    returnanger.push(situationanger.filter(x => x=="직장, 업무 스트레스").length)
    returnanger.push(situationanger.filter(x => x=="연애, 결혼, 출산").length)
    returnanger.push(situationanger.filter(x => x=="진로, 취업, 직장").length)
    returnanger.push(situationanger.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnanger.push(situationanger.filter(x => x=="건강, 죽음").length)
    //기쁨 상황
    returnhappy.push(situationhappy.filter(x => x=="가족관계").length)
    returnhappy.push(situationhappy.filter(x => x=="학업 및 진로").length)
    returnhappy.push(situationhappy.filter(x => x=="학교폭력/따돌림").length)
    returnhappy.push(situationhappy.filter(x => x=="대인관계").length)
    returnhappy.push(situationhappy.filter(x => x=="직장, 업무 스트레스").length)
    returnhappy.push(situationhappy.filter(x => x=="연애, 결혼, 출산").length)
    returnhappy.push(situationhappy.filter(x => x=="진로, 취업, 직장").length)
    returnhappy.push(situationhappy.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnhappy.push(situationhappy.filter(x => x=="건강, 죽음").length)
    //슬픔 상황
    returnsad.push(situationsad.filter(x => x=="가족관계").length)
    returnsad.push(situationsad.filter(x => x=="학업 및 진로").length)
    returnsad.push(situationsad.filter(x => x=="학교폭력/따돌림").length)
    returnsad.push(situationsad.filter(x => x=="대인관계").length)
    returnsad.push(situationsad.filter(x => x=="직장, 업무 스트레스").length)
    returnsad.push(situationsad.filter(x => x=="연애, 결혼, 출산").length)
    returnsad.push(situationsad.filter(x => x=="진로, 취업, 직장").length)
    returnsad.push(situationsad.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnsad.push(situationsad.filter(x => x=="건강, 죽음").length)
    //당황 상황
    returnembarrass.push(situationemberrass.filter(x => x=="가족관계").length)
    returnembarrass.push(situationemberrass.filter(x => x=="학업 및 진로").length)
    returnembarrass.push(situationemberrass.filter(x => x=="학교폭력/따돌림").length)
    returnembarrass.push(situationemberrass.filter(x => x=="대인관계").length)
    returnembarrass.push(situationemberrass.filter(x => x=="직장, 업무 스트레스").length)
    returnembarrass.push(situationemberrass.filter(x => x=="연애, 결혼, 출산").length)
    returnembarrass.push(situationemberrass.filter(x => x=="진로, 취업, 직장").length)
    returnembarrass.push(situationemberrass.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnembarrass.push(situationemberrass.filter(x => x=="건강, 죽음").length)
    //불안 상황
    returnunrest.push(situationunrest.filter(x => x=="가족관계").length)
    returnunrest.push(situationunrest.filter(x => x=="학업 및 진로").length)
    returnunrest.push(situationunrest.filter(x => x=="학교폭력/따돌림").length)
    returnunrest.push(situationunrest.filter(x => x=="대인관계").length)
    returnunrest.push(situationunrest.filter(x => x=="직장, 업무 스트레스").length)
    returnunrest.push(situationunrest.filter(x => x=="연애, 결혼, 출산").length)
    returnunrest.push(situationunrest.filter(x => x=="진로, 취업, 직장").length)
    returnunrest.push(situationunrest.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnunrest.push(situationunrest.filter(x => x=="건강, 죽음").length)
    //상처 상황
    returnscar.push(situationscar.filter(x => x=="가족관계").length)
    returnscar.push(situationscar.filter(x => x=="학업 및 진로").length)
    returnscar.push(situationscar.filter(x => x=="학교폭력/따돌림").length)
    returnscar.push(situationscar.filter(x => x=="대인관계").length)
    returnscar.push(situationscar.filter(x => x=="직장, 업무 스트레스").length)
    returnscar.push(situationscar.filter(x => x=="연애, 결혼, 출산").length)
    returnscar.push(situationscar.filter(x => x=="진로, 취업, 직장").length)
    returnscar.push(situationscar.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnscar.push(situationscar.filter(x => x=="건강, 죽음").length)
    //중립 상황
    returnneutral.push(situationneutral.filter(x => x=="가족관계").length)
    returnneutral.push(situationneutral.filter(x => x=="학업 및 진로").length)
    returnneutral.push(situationneutral.filter(x => x=="학교폭력/따돌림").length)
    returnneutral.push(situationneutral.filter(x => x=="대인관계").length)
    returnneutral.push(situationneutral.filter(x => x=="직장, 업무 스트레스").length)
    returnneutral.push(situationneutral.filter(x => x=="연애, 결혼, 출산").length)
    returnneutral.push(situationneutral.filter(x => x=="진로, 취업, 직장").length)
    returnneutral.push(situationneutral.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnneutral.push(situationneutral.filter(x => x=="건강, 죽음").length)

    const maxarr = [resultarr.분노,resultarr.슬픔,resultarr.불안,resultarr.상처,resultarr.당황,resultarr.기쁨,resultarr.중립];
    let maxemotion = maxarr[0];
    let maxindex = 0;
    for(let v=0; v<maxarr.length; v++){
        if(maxarr[v]>maxemotion){
            maxindex+=1;
        }
    }
    let max = '';
    if(maxindex==0){max = '분노'}else if(maxindex==1){max='슬픔'}else if(maxindex==2){max='불안'}else if(maxindex==3){max='상처'}else if(maxindex==4){max='당황'}else if(maxindex==5){max='기쁨'}else{max='중립'}

    const context = {resultarr,max,feeling,sad,happy,embarrass,scar,unrest,anger,neutral,returnanger,returnembarrass,returnhappy,returnsad,returnscar,returnunrest,returnneutral}

    res.render('detailpage/week',context)
})




detailRouter.get('/monthly',async (req,res)=>{
    const {year,month,feeling} = req.query;
    const post = await Post.find({$and:[{"author":req.user},{"date.year":year},{"date.month":month}]});
    let jsonpost = JSON.parse(JSON.stringify(post));
    //해당 달 감정별 퍼센트 다 더하기
    let resultarr = {'분노':0,'슬픔':0,'불안':0,'상처':0,'당황':0,'기쁨':0,'중립':0}
    //감정별 퍼센트 리스트
    let anger = [];
    let sad = [];
    let unrest = [];
    let scar = [];
    let embarrass =[];
    let happy = [];
    let neutral = [];
    for(let i=0; i<post.length; i++){
        jsonpost[i].emotion = JSON.parse(jsonpost[i].emotion)
        resultarr.분노 += jsonpost[i].emotion.분노
        anger.push(jsonpost[i].emotion.분노)
        resultarr.슬픔 += jsonpost[i].emotion.슬픔
        sad.push(jsonpost[i].emotion.슬픔)
        resultarr.불안 += jsonpost[i].emotion.불안
        unrest.push(jsonpost[i].emotion.불안)
        resultarr.상처 += jsonpost[i].emotion.상처
        scar.push(jsonpost[i].emotion.불안)
        resultarr.당황 += jsonpost[i].emotion.당황
        embarrass.push(jsonpost[i].emotion.당황)
        resultarr.기쁨 += jsonpost[i].emotion.기쁨
        happy.push(jsonpost[i].emotion.기쁨)
        resultarr.중립 += jsonpost[i].emotion.중립
        neutral.push(jsonpost[i].emotion.중립)
    }
    let jsonsituationarr = [];
    for(let i=0; i<jsonpost.length; i++){
        jsonsituationarr.push(JSON.parse(jsonpost[i].situation));
    }
    let situationanger = [];
    let situationsad= [];
    let situationhappy = [];
    let situationscar = [];
    let situationemberrass = [];
    let situationunrest = [];
    let situationneutral = [];
    for(let i=0; i<jsonsituationarr.length; i++){
        if(Object.keys(jsonsituationarr[i])=="분노"){
            situationanger.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="슬픔"){
            situationsad.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="기쁨"){
            situationhappy.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="불안"){
            situationunrest.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="당황"){
            situationemberrass.push(Object.values(jsonsituationarr[i])[0])
        }else if(Object.keys(jsonsituationarr[i])=="상처"){
            situationscar.push(Object.values(jsonsituationarr[i])[0])
        }else{
            situationneutral.push(Object.values(jsonsituationarr[i])[0])
        }
    }
    let returnanger = [];
    let returnhappy = [];
    let returnsad = [];
    let returnscar = [];
    let returnembarrass = [];
    let returnunrest = [];
    let returnneutral = [];
    //분노 상황
    returnanger.push(situationanger.filter(x => x=="가족관계").length)
    returnanger.push(situationanger.filter(x => x=="학업 및 진로").length)
    returnanger.push(situationanger.filter(x => x=="학교폭력/따돌림").length)
    returnanger.push(situationanger.filter(x => x=="대인관계").length)
    returnanger.push(situationanger.filter(x => x=="직장, 업무 스트레스").length)
    returnanger.push(situationanger.filter(x => x=="연애, 결혼, 출산").length)
    returnanger.push(situationanger.filter(x => x=="진로, 취업, 직장").length)
    returnanger.push(situationanger.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnanger.push(situationanger.filter(x => x=="건강, 죽음").length)
    //기쁨 상황
    returnhappy.push(situationhappy.filter(x => x=="가족관계").length)
    returnhappy.push(situationhappy.filter(x => x=="학업 및 진로").length)
    returnhappy.push(situationhappy.filter(x => x=="학교폭력/따돌림").length)
    returnhappy.push(situationhappy.filter(x => x=="대인관계").length)
    returnhappy.push(situationhappy.filter(x => x=="직장, 업무 스트레스").length)
    returnhappy.push(situationhappy.filter(x => x=="연애, 결혼, 출산").length)
    returnhappy.push(situationhappy.filter(x => x=="진로, 취업, 직장").length)
    returnhappy.push(situationhappy.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnhappy.push(situationhappy.filter(x => x=="건강, 죽음").length)
    //슬픔 상황
    returnsad.push(situationsad.filter(x => x=="가족관계").length)
    returnsad.push(situationsad.filter(x => x=="학업 및 진로").length)
    returnsad.push(situationsad.filter(x => x=="학교폭력/따돌림").length)
    returnsad.push(situationsad.filter(x => x=="대인관계").length)
    returnsad.push(situationsad.filter(x => x=="직장, 업무 스트레스").length)
    returnsad.push(situationsad.filter(x => x=="연애, 결혼, 출산").length)
    returnsad.push(situationsad.filter(x => x=="진로, 취업, 직장").length)
    returnsad.push(situationsad.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnsad.push(situationsad.filter(x => x=="건강, 죽음").length)
    //당황 상황
    returnembarrass.push(situationemberrass.filter(x => x=="가족관계").length)
    returnembarrass.push(situationemberrass.filter(x => x=="학업 및 진로").length)
    returnembarrass.push(situationemberrass.filter(x => x=="학교폭력/따돌림").length)
    returnembarrass.push(situationemberrass.filter(x => x=="대인관계").length)
    returnembarrass.push(situationemberrass.filter(x => x=="직장, 업무 스트레스").length)
    returnembarrass.push(situationemberrass.filter(x => x=="연애, 결혼, 출산").length)
    returnembarrass.push(situationemberrass.filter(x => x=="진로, 취업, 직장").length)
    returnembarrass.push(situationemberrass.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnembarrass.push(situationemberrass.filter(x => x=="건강, 죽음").length)
    //불안 상황
    returnunrest.push(situationunrest.filter(x => x=="가족관계").length)
    returnunrest.push(situationunrest.filter(x => x=="학업 및 진로").length)
    returnunrest.push(situationunrest.filter(x => x=="학교폭력/따돌림").length)
    returnunrest.push(situationunrest.filter(x => x=="대인관계").length)
    returnunrest.push(situationunrest.filter(x => x=="직장, 업무 스트레스").length)
    returnunrest.push(situationunrest.filter(x => x=="연애, 결혼, 출산").length)
    returnunrest.push(situationunrest.filter(x => x=="진로, 취업, 직장").length)
    returnunrest.push(situationunrest.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnunrest.push(situationunrest.filter(x => x=="건강, 죽음").length)
    //상처 상황
    returnscar.push(situationscar.filter(x => x=="가족관계").length)
    returnscar.push(situationscar.filter(x => x=="학업 및 진로").length)
    returnscar.push(situationscar.filter(x => x=="학교폭력/따돌림").length)
    returnscar.push(situationscar.filter(x => x=="대인관계").length)
    returnscar.push(situationscar.filter(x => x=="직장, 업무 스트레스").length)
    returnscar.push(situationscar.filter(x => x=="연애, 결혼, 출산").length)
    returnscar.push(situationscar.filter(x => x=="진로, 취업, 직장").length)
    returnscar.push(situationscar.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnscar.push(situationscar.filter(x => x=="건강, 죽음").length)
    //중립 상황
    returnneutral.push(situationneutral.filter(x => x=="가족관계").length)
    returnneutral.push(situationneutral.filter(x => x=="학업 및 진로").length)
    returnneutral.push(situationneutral.filter(x => x=="학교폭력/따돌림").length)
    returnneutral.push(situationneutral.filter(x => x=="대인관계").length)
    returnneutral.push(situationneutral.filter(x => x=="직장, 업무 스트레스").length)
    returnneutral.push(situationneutral.filter(x => x=="연애, 결혼, 출산").length)
    returnneutral.push(situationneutral.filter(x => x=="진로, 취업, 직장").length)
    returnneutral.push(situationneutral.filter(x => x=="재정, 은퇴, 노후준비").length)
    returnneutral.push(situationneutral.filter(x => x=="건강, 죽음").length)

    const maxarr = [resultarr.분노,resultarr.슬픔,resultarr.불안,resultarr.상처,resultarr.당황,resultarr.기쁨,resultarr.중립];
    let maxemotion = maxarr[0];
    let maxindex = 0;
    for(let v=0; v<maxarr.length; v++){
        if(maxarr[v]>maxemotion){
            maxindex+=1;
        }
    }

    let max = '';
    if(maxindex==0){max = '분노'}else if(maxindex==1){max='슬픔'}else if(maxindex==2){max='불안'}else if(maxindex==3){max='상처'}else if(maxindex==4){max='당황'}else if(maxindex==5){max='기쁨'}else{max='중립'}
    if(post.length == 0){
        res.render('error/notfound');
    }else{
        // let q = '';
        // if(feeling == 'sad'){q = sad;}else if(feeling == 'happy'){q = happy;}else if(feeling == 'embarrass'){q = embarrass;}else if(feeling == 'scar'){q = scar;}else if(feeling == 'unrest'){q = unrest;}else{q = anger;}
        const context = {resultarr,max,year,month,feeling,sad,happy,embarrass,scar,unrest,anger,returnanger,neutral,returnembarrass,returnhappy,returnsad,returnscar,returnunrest,returnneutral}
        res.render('detailpage/monthly',context)
    }
})


//일자 선택 라우터
detailRouter.get('/dayselect',isLoggedin,(req,res)=>{
    const date = new Date();
    res.render('detailselect/dailyselect.ejs',{date})
})
detailRouter.get('/monthselect',isLoggedin,(req,res)=>{
    const date = new Date();
    const year = date.getFullYear();
    res.render('detailselect/monthselect.ejs',{year})
})

module.exports = detailRouter;