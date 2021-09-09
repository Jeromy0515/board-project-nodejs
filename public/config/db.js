const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'board_project'
});

db.connect();

module.exports = db;