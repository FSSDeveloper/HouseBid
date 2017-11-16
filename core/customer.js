var dbConnection = require("./db-connection");

function login(customer) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "SELECT * FROM customer WHERE email = \"" + customer.email + "\" AND password = \"" + customer.password + "\"";
        console.log("Query to be inserted: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Query executed successfully.");
            console.log(result);
        });
    });
}

function addCustomer(customer) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "INSERT INTO customer (name, email, password, mobile) VALUES(\"" + customer.name + "\", \"" + customer.email + "\", \"" + customer.password + "\", \"" + customer.mobile + "\")";
        console.log("Query to be inserted: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Query executed successfully.");
        });
    });
}

function getCustomerByCustomerId(customerId) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "SELECT * FROM customer WHERE customer_id = " + customerId;
        console.log("Query to be inserted: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Query executed successfully.");
            console.log(result);
        });
    });
}

module.exports.addCustomer = addCustomer;
module.exports.login = login;
module.exports.getCustomerByCustomerId = getCustomerByCustomerId;