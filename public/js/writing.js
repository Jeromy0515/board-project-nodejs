var deleteCookie = function(){
    document.cookie = document.cookie + '; Max-age=0';
    console.log(document.cookie);
};

const btn = document.navForm.getElementsByClassName('nav-link')[2];

if(document.cookie){
    btn.textContent = "로그아웃";

}

btn.addEventListener('click',(event)=>{
    if(btn.textContent == '로그아웃'){
        btn.textContent = '로그인';
        deleteCookie();
        location.href='/';
    }else{
        location.href = 'login';
    }
})


