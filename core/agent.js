var dbConnection = require("./db-connection");


function getAgent(agentId) {
    var con = dbConnection.getConnection();
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected");
        var sql = "SELECT * FROM agents WHERE agent_id = " + agentId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
}

module.exports.getAgent = getAgent;