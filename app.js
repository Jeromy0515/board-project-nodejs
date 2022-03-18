const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cryptoJS = require('crypto-js');

var board_id;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'board_project'
});

const corsOption = {
    origin:'http://localhost:3000',
    credential:true
};

app.use(bodyParser());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(cors(corsOption));
app.use('/static',express.static('public'));

app.set('views',__dirname + '/public/views');
app.set('view engine', 'ejs');

app.engine('html', ejs.renderFile);


// get
app.get('/', (req, res) => {

    var cookies = {};
    if(req.headers.cookie !== undefined){
        cookies = cookie.parse(req.headers.cookie);
        var id = decrypt(cookies.id_enc,"key");
    }

    pool.getConnection((err,connection) => {
        if(err)
            throw err;

        connection.query(`select * from board as b 
                          left join user as u on u.user_id = b.user_id`,
            (error,results) => {

                if(error)
                    throw error;

                res.render('main.ejs',{
                    data:results,
                    cookie_id:id
                });

            });

    });


});

app.get('/notice',(req,res)=>{
    const id = 'admin';

    pool.getConnection((err,connection) => {
        if(err)
            throw err;

        connection.query(`select * from board as b 
                          left join user as u on u.user_id = b.user_id
                          where u.user_id = '${id}'`,
            (error,results) => {

                if(error)
                    throw error;

                res.render('notice.ejs',{data:results});

            });

    });
})

app.get('/writing', (req, res) => {
    res.render('writing.ejs');

});

app.get('/login', (req, res) => {
    res.render('login.ejs');

});

app.get('/sign_up', (req, res) => {
    res.render('sign_up.ejs');

});

app.get('/posting',(req,res)=>{
    const boardID = req.query;
    console.log(boardID);


    pool.getConnection((err,connection) => {
        if(err)
            throw err;

        connection.query(`select board_id,board_title,board_content,board_date from board
                            where board_id = ${board_id};`,
            (error,boardResults) => {

                if(error)
                    throw error;

                connection.query(`select r.reply_content,r.reply_date,u.user_name from reply as r 
                                  left join user as u on r.user_id = u.user_id
                                  where board_id = ${board_id};`,
                    (error,replyResults) => {

                        if(error)
                            throw error;

                        res.render('posting.ejs',{
                            'board':boardResults,
                            'reply':replyResults
                        });

                    });


            });


    });


});

app.get('/mypost', (req, res) => {
    const id = getIDFromCookie();

    pool.getConnection((err,connection) => {
        if(err)
            throw err;

          connection.query(`select * from board where user_id like ?`,[id],
            (error,results) => {

                if(error)
                    throw error;

                res.render('mypost.ejs',{data:results});

            });

    });

});

// post
app.post('/',(req,res)=>{

});

app.post('/sign_up',(req,res) => {
    var name = req.body.name;
    var id = req.body.id;
    var password = req.body.password;
    var email = req.body.email;

    pool.getConnection((err,connection) => {
        if(err)
            throw err;

        connection.query(`insert into user values('${id}','${encrypt(password,"key")}','${name}','${email}')`,
            (error,results) => {

                if(error)
                    throw error;

                res.redirect('/');

            });

    });

});

app.post('/writing',(req,res)=>{
    var title = req.body.title;
    var content = req.body.content;

    var cookies = {};
    if(req.headers.cookie !== undefined){
        cookies = cookie.parse(req.headers.cookie);
        var id = decrypt(cookies.id_enc,"key");
    }

    pool.getConnection((err,connection) => {
        if(err)
            throw err;

        connection.query(`insert into board values(0,?,?,now(),0,?)`,[title,content,id],
            (error,results) => {

                if(error)
                    throw error;

                res.redirect('/');
            });

    });

})

app.post('/login',(req,res)=>{
    const id = req.body.id;
    const password = req.body.password;
    console.log(id+','+password);

    pool.getConnection((err, connection) => {
        if(err)
            throw err;

        connection.query(`SELECT *
                          FROM USER
                          WHERE USER_ID LIKE '${id}'`, (error, results,fields) => {
            if(error)
                throw error;

            if(results[0] == undefined || decrypt(results[0].user_pw,"key") != password){
                console.log('로그인 실패!');
                res.redirect('/login');
            }else{
                res.cookie('id_enc',encrypt(id,"key"));
                res.redirect('/');
                console.log(req.headers.cookie);
            }
        });
    });

});

app.post('/posting', (req,res)=>{
    console.log(req.body);
    board_id = req.body.board_id;
    res.redirect('/posting');
});

app.post('/email',(req,res)=>{
    const userEmail = req.body.email;
    const userName = req.body.name;

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host:'smtp.gmail.com',
        auth:{
            user:'qkr07224@gmail.com',
            pass:'park1973**'
        }
    }));

    var ranNum = Math.floor(Math.random()*(899999))+100000;

    var mailOptions = {
      from: 'qkr07224@gmail.com',
      to:userEmail,
      subject: '인공과 커뮤니티 본인인증',
      html:`<p>안녕하세요, ${userName}님</p>
            <br>
            <p>본인 인증을 위해 아래의 코드를 인증 확인란에 입력해 주세요.</p>
            <br>
            <p><b>${ranNum}</b></p>`
    };

    transporter.sendMail(mailOptions,(error, info)=>{
       if(error){
           res.json({'isNotExistEmail': true});
           console.log(error);
       } else{
           console.log('Email sent:' + info.response);
           res.json({'certificationNumber':ranNum});
       }

    });

});

app.post('/checkID',(req,res)=>{
    var id = req.body.id;

    pool.getConnection((err, connection) => {
        if(err)
            throw err;

        connection.query(`SELECT *
                          FROM USER
                          WHERE USER_ID LIKE '${id}'
                          `, (error, results) => {
            if(error)
                throw error;

            res.json({'isOverlap':results[0] != undefined ? true : false});

        });
    });
})

app.post('/reply', (req, res) => {
    var cookies = {};
    if(req.headers.cookie !== undefined){
        cookies = cookie.parse(req.headers.cookie);
        var id = decrypt(cookies.id_enc,"key");
    }

    const param = [req.body.reply_content,id,req.body.board_id];

    pool.getConnection((err, connection) => {
        if(err)
            throw err;

        connection.query(`insert into reply values(0,?,now(),?,?)`, param,(error, results) => {
            if(error)
                throw error;

            res.json({});

        });
    });
});

const server = app.listen(3000,()=>{
    console.log('Start app : localhost:3000');
});

app.all('*', (req, res) => {
    res.status(404).send('<h1 align="center">ERROR 404 NOT FOUND - 페이지를 찾을 수 없습니다.</h1>');
});

var encrypt = function(data,key){
    return cryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}



var decrypt = function(text,key){
    try{
        const bytes = cryptoJS.AES.decrypt(text, key);
        return JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
    }catch(err){
        console.log(err);
        return;
    }
}

function getIDFromCookie(){
    var cookies = {};
    if(req.headers.cookie !== undefined){
        cookies = cookie.parse(req.headers.cookie);
        return decrypt(cookies.id_enc,"key");
    }
    return null;
}

module.exports = app;
