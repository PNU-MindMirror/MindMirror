window.scrollTo(0,document.body.scrollHeight);

const toggle = document.querySelector("#toggle");
const list = document.querySelector("#menu");
toggle.addEventListener('click',()=>{
    if(list.style.display === "flex"){
        list.style.display = 'none';
    }else{
        list.style.display = 'flex';
    }
})
