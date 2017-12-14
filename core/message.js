//-- Imam Bux
//-- Farzaneh Sabzi

var mysql = require("./db-connection").pool;

function getMessageByMessageId(messageId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT * FROM message WHERE message_id = " + con.escape(messageId);
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else callback(null, result);
        });
        con.release();
    });
}

function getMessagesByUserId(userId, callback) {
    mysql.getConnection(function(err, con) {
        var sql = "SELECT m.*, u.name \"sender_name\" FROM message m, user u WHERE m.sender_id = u.user_id and receiver_id = " + con.escape(userId);
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else {
                var returnResult = new Array();

                var allIds = new Array();
                for (i = 0; i < result.length; i++) {
                    allIds.push(result[i].sender_id);
                }
                var idsSet = Array.from(new Set(allIds));

                for (i = 0; i < idsSet.length; i++) {
                    var groupOfMessages = new Array();
                    for (j = 0; j < result.length; j++) {
                        if(result[j].sender_id === idsSet[i]) {
                            groupOfMessages.push(result[j]);
                        }
                    }
                    returnResult.push(groupOfMessages);
                }
                callback(null, returnResult);
            }
        });
        con.release();
    });
}

function getConversation(senderId, receiverId, callback) {
    mysql.getConnection(function(err, con) {
        // var sql = "SELECT * FROM user WHERE user_id = " + userId;
        var sql = "SELECT * FROM message WHERE sender_id IN(" + con.escape(senderId)  +"," + con.escape(receiverId) + ") AND \n\
        receiver_id in(" + con.escape(senderId)  +"," + con.escape(receiverId) + ")";
        console.log("Query to be executed: " + sql);
        con.query(sql, function (err, result) {
            if (err) callback(err, null);
            else {
                callback(null, result);
            }
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
                receiver_id: message.receiverId,
                listing_id: message.listingId
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
module.exports.getConversation = getConversation;