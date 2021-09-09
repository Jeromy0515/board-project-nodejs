// var sendAjax = function(url, _data,onLoad){
//
//     var data = JSON.stringify(_data);
//
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST',url);
//     xhr.setRequestHeader('Content-type', "application/json");
//     xhr.send(data);
//
//     xhr.addEventListener('load', () => {
//         onLoad(xhr);
//     });
// }
//
// document.forms[0].querySelector('#loginButton').addEventListener('click',() => {
//     let data = {
//         'id': document.forms[0].id.value,
//         'password': document.forms[0].password.value
//     }
//     sendAjax('http://localhost:80/hasLogin',data,(xhr)=>{
//         if(!JSON.parse(xhr.responseText).isCorrect){
//             alert('아이디 혹은 비밀번호가 일치하지 않습니다.');
//             location.reload();
//         }
//     });
//
// });

document.forms[0].querySelector('#cancelButton').addEventListener('click',()=>{
   history.back();
});




// TODO: login submit 말고 ajax로 변환

// TODO:취소 버튼 클릭시 이전 페이지 이동