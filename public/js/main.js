
var deleteCookie = function(){
    document.cookie = document.cookie + '; Max-age=0';
    console.log(document.cookie);
};

const loginPageBtn = document.navForm.getElementsByClassName('nav-link')[2];
const writingBtn = document.getElementsByClassName('btn btn-primary')[0];

console.log(writingBtn);

const goToWrintingPage = function(event){
    if(document.cookie){
        location.href = 'writing';
    }else{
        alert('로그인을 해야 이용하실 수 있습니다.');
        location.href = 'login';
    }
}

writingBtn.addEventListener('click',goToWrintingPage);

if(document.cookie){
    loginPageBtn.textContent = "로그아웃";
}

loginPageBtn.addEventListener('click',(event)=>{
    if(loginPageBtn.textContent == '로그아웃'){
        loginPageBtn.textContent = '로그인';
        deleteCookie();
        location.href='/';
    }else{
        location.href = 'login';
    }
})

async function sendGETRequest(boardID){

    let data = {
        'board_id' : boardID
    };

    console.log(data.board_id);

    await sendAjax('POST',`http://localhost:3000/posting`,data,(xhr)=>{
        location.href = '/posting';
    });
}

var sendAjax = function(method,url,_data,onLoad){

    var data = JSON.stringify(_data);

    var xhr = new XMLHttpRequest();
    xhr.open(method,url,true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    xhr.addEventListener('load', () => {
        onLoad(xhr);
    });
}