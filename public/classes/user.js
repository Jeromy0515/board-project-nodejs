const db = require('../config/db');

class User{
    id;
    password;

    constructor(id,password){
        this.id = id;
        this.password = password;
    }

    login = (res) => {

        const response = {
            id: this.id,
            password: this.password
        };

        db.query('SELECT * FROM USER WHERE USER_ID LIKE ? AND USER_PW LIKE ?',
            [this.id,this.password], (err,results) => {

                if(err)
                    throw err;
                if(results[0] != undefined){
                    response.isSuccess = true;
                    return res.json(response);
                }
                return res.json(response);
            });
    };
}

module.exports = User;