const textarea = document.querySelector('textarea');
const btn = document.querySelector('#sb_btn');
btn.addEventListener("click",(event)=>{
    if(textarea.value.length<2){
                event.preventDefault()
            }
});
