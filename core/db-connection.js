var mysql = require("mysql");

var con = mysql.createConnection({
    host:   process.env.SQL_HOST,
    port:   3306,
    user:   process.env.SQL_USR,
    password:   process.env.SQL_PWS,
    database:   process.env.SQL_DB
});

function getConnection() {
    if(!con){
        // Connects to Database
        con.connect();
    }
    return con;
};

module.exports.getConnection = getConnection;
