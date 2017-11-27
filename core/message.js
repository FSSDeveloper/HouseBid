var mysql = require("./db-connection").pool;

function getMessageByMessageId(messageId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT * FROM message WHERE message_id = " + messageId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
    });
}

function getMessagesByUserId(userId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT * FROM message WHERE sender_id = " + userId + " OR receiver_id = " + userId;
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function addMessage(message, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "INSERT INTO message SET ?",
            values = {
                message: message.message,
                sender_id: message.senderId,
                receiver_id: message.receiverId
            };
        con.query(sql, values, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

module.exports.addMessage = addMessage;
module.exports.getMessagesByUserId = getMessagesByUserId;
module.exports.getMessageByMessageId = getMessageByMessageId;