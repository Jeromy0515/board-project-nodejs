
var deleteCookie = function(){
    document.cookie = document.cookie + '; Max-age=0';
    console.log(document.cookie);
};

const btn = document.getElementsByClassName('nav-link')[2];

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


const container = document.getElementsByClassName('container')[0]

container.getElementsByClassName('form-control')[0].addEventListener('click',()=>{
    if(!document.cookie){
        alert('로그인을 해야 이용하실 수 있습니다.');
        location.href = 'login';
    }
})

var sendReply = function(boardID){
    if(!document.cookie){
        alert('로그인을 해야 이용하실 수 있습니다.');
        location.href = 'login';
        return;
    }

    const replyContent = container.getElementsByClassName('form-control')[0].value;
    const userID = document.cookie.split('=')[1];
    const data = {
        'reply_content': replyContent,
        'user_id': userID,
        'board_id': boardID
    }

    sendAjax('http://localhost:3000/reply', data, (xhr) => {
        location.reload();
    });

}

var sendAjax = function (url, _data, onLoad) {

    var data = JSON.stringify(_data);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data);

    xhr.addEventListener('load', () => {
        onLoad(xhr);
    });

}