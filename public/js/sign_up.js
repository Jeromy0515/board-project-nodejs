var certificationNumber;
var checkOverlap = false;

function setValid(element,type,index,message){

    if(element.getElementsByClassName('invalid-feedback')[0] != undefined)
        element.getElementsByClassName('invalid-feedback')[0].remove();

    if(element.getElementsByClassName('valid-feedback')[0] != undefined)
        element.getElementsByClassName('valid-feedback')[0].remove();

    const value = element.getElementsByClassName('form-control')[index].value;
    element.getElementsByClassName('form-control')[index].className = `form-control is-${type}`;
    element.innerHTML = element.innerHTML + `<div class="${type}-feedback">${message}</div>`;
    element.getElementsByClassName('form-control')[index].value = value;

}

function inputTagClickActionListenr(element,index){

    if(element.getElementsByClassName('form-control')[index].className == 'form-control is-invalid' ||
        element.getElementsByClassName('form-control')[index].className == 'form-control is-valid')
        element.getElementsByClassName('form-control')[index].className = 'form-control';

    if(element.getElementsByClassName('invalid-feedback')[0] != undefined)
        element.getElementsByClassName('invalid-feedback')[0].remove();

    if(element.getElementsByClassName('valid-feedback')[0] != undefined)
        element.getElementsByClassName('valid-feedback')[0].remove();

}

var divID = document.forms[0].querySelectorAll('.input-group')[3];
var divCertification = document.forms[0].querySelectorAll('.input-group')[2];
var divPW = document.forms[0].querySelectorAll('.input-group')[5];
var divName = document.forms[0].querySelectorAll('.input-group')[0];
var divEmail = document.forms[0].querySelectorAll('.input-group')[1];

for (let i = 0; i < document.forms[0].querySelectorAll('.input-group').length; i++) {
    document.forms[0].querySelectorAll('.input-group')[i].addEventListener('click', () => {
        inputTagClickActionListenr(document.querySelectorAll('.input-group')[i],0);
    });
}

document.forms[0].querySelector('#loginButton').addEventListener('click', () => {
    if(divName.getElementsByClassName('form-control')[0].value == ''){
        setValid(divName, 'invalid', 0, '이름을 입력해주세요.');
        return;
    }

    if (!checkOverlap) {
        setValid(divID,'invalid',0,'아이디 중복확인을 해주세요.');
        return;
    }

    if (certificationNumber.toString() != document.forms[0].certificationName.value) {
        setValid(divCertification,'invalid',0,'올바른 인증번호를 입력해주세요.');
        return;
    }

    if (document.forms[0].userPW.value != document.forms[0].checkPW.value) {
        setValid(divPW, 'invalid', 0, '비밀번호를 확인해주세요.');
        return;
    }

    let data = {
        'name': document.forms[0].userName.value,
        'id': document.forms[0].userID.value,
        'password': document.forms[0].userPW.value,
        'email': document.forms[0].userEmail.value
    };

    sendAjax("http://localhost:3000/sign_up", data, (xhr) => {
        alert('회원가입이 성공적으로 됐습니다!');
        location.href = '/';
    });
    checkOverlap = false;

});


document.forms[0].querySelector('#overlapCheckButton').addEventListener('click', () => {
    sendAjax("http://localhost:3000/checkID", {'id': document.forms[0].userID.value}, (xhr) => {
        let isOverlap = JSON.parse(xhr.responseText).isOverlap;
        if (isOverlap) {
            setValid(divID, 'invalid', 0, '중복되는 아이디가 존재합니다.');
            checkOverlap = false;
        } else {
            setValid(divID, 'valid', 0, '사용가능한 아이디 입니다.');
            checkOverlap = true;
        }

    });
});

document.forms[0].querySelector('#emailCheckButton').addEventListener('click', () => {
    let data = {
        'name': document.forms[0].userName.value,
        'email': document.forms[0].userEmail.value
    }

    let isNotExistEmail;

    sendAjax('http://localhost:3000/email', data, (xhr) => {
        if (JSON.parse(xhr.responseText).isNotExistEmail) {
            isNotExistEmail = JSON.parse(xhr.responseText).isNotExistEmail;
            console.log(isNotExistEmail);
            setValid(divEmail, 'invalid', 0, '존재하지 않는 이메일입니다.');
            return;
        }
        certificationNumber = JSON.parse(xhr.responseText).certificationNumber;
        console.log(certificationNumber);
    });

    if (isNotExistEmail)
        return;

    document.forms[0].querySelectorAll('.input-group')[2].innerHTML =
        '<input type="text" class="form-control" name="certificationName" id="input-certificationNumber" ' +
        'aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="인증번호">';

    document.forms[0].querySelector('#overlapCheckButton').style.top = '234px';
});

document.forms[0].querySelector('#cancelButton').addEventListener('click', () => {
    history.back();
})

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

// TODO: 로그인 실패 했을시 로그인 실패 메세지 출력

