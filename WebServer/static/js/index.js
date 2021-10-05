const login = document.querySelector('#login');
const loginmodal = document.querySelector('.LoginModal');
const mdclose = document.querySelector('.mdclose');

mdclose.addEventListener('click',()=>{
    loginmodal.style.display='none';
})

login.addEventListener('click',(e)=>{
    loginmodal.style.display = 'flex';
})