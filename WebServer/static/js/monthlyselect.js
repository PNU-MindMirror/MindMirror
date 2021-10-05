const toggle = document.querySelector("#toggle");
const list = document.querySelector("#menu");
toggle.addEventListener('click',()=>{
    if(list.style.display === "flex"){
        list.style.display = 'none';
    }else{
        list.style.display = 'flex';
    }
})

const date = new Date();
var year = date.getFullYear();
const Y = document.querySelector("#Y");
const row1 = document.querySelector("#row1");
const row2 = document.querySelector("#row2");
const row3 = document.querySelector("#row3");
function setYear(){
    Y.innerHTML = `${year}년`;
    row1.innerHTML = `<div><a style="color:blue" href="monthly?year=${year}&month=1">1월</a></div>
    <div><a href="monthly?year=${year}&month=2">2월</a></div>
    <div><a href="monthly?year=${year}&month=3">3월</a></div>
    <div><a href="monthly?year=${year}>&month=4">4월</a></div>`
    row2.innerHTML =  `<div><a href="monthly?year=${year}&month=5">5월</a></div>
    <div><a href="monthly?year=${year}&month=6">6월</a></div>
    <div><a href="monthly?year=${year}&month=7">7월</a></div>
    <div><a href="monthly?year=${year}>&month=8">8월</a></div>`
    row3.innerHTML =  `<div><a href="monthly?year=${year}&month=9">9월</a></div>
    <div><a href="monthly?year=${year}&month=10">10월</a></div>
    <div><a href="monthly?year=${year}&month=11">11월</a></div>
    <div><a style="color:red" href="monthly?year=${year}>&month=12">12월</a></div>`
}

const before = document.querySelector("#before");
before.addEventListener("click",click_before);
function click_before(){
    year -=1
    setYear();
}
const next = document.querySelector("#next");
next.addEventListener("click",click_next);
function click_next(){
    year +=1
    setYear();
}

setYear()