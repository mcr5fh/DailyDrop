const pgController = require("../postgres/usersPgController.js")

exports.getUserInfo = function (req, res) {
    // Get user id from params
    const userId = req.params.user_id

    // Make SQL query to get rows
    pgController.getUserInfo(userId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the get users info callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.insertUser = function (req, res) {
    const userId = req.body.user_id;
    const premium = req.body.premium;
    const name = req.body.name;
    const refreshToken = req.body.refresh_token;
    console.log("insert user USERID: " + userId)

    // Make SQL query to get rows
    pgController.insertUser(userId, premium, name, refreshToken, function (rows) {
        console.log("*******************************************\n");
        console.log("In the insert user callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.addUserToGroup = function (req, res) {
    const userId = req.body.user_id;
    const groupId = req.body.group_id;

    // Make SQL query to get rows
    pgController.addUserToGroup(userId, groupId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the insert user to group callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.updateUser = function (req, res) {
    // Get user id from params
    const userId = req.params.user_id
    const premium = req.body.premium;
    const name = req.body.name;
    const refreshToken = req.body.refresh_token;

    // Make SQL query to get rows
    pgController.updateUser(userId, premium, name, refreshToken, function (rows) {
        console.log("*******************************************\n");
        console.log("In the update user info callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}
