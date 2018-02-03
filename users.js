const pgHelper = require("pgHelper.js")

exports.getUserInfo = function (req, res) {
    // Get user id from params
    const userId = req.params.user_id

    // Make SQL query to get rows
    pgHelper.getUserInfo(userId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the get users info callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.insertUser = function (req, res) {
    const user_id = req.body.user_id;
    const premium = req.body.premium;
    const name = req.body.name;
    const refresh_token = req.body.refresh_token;
    console.log("insert user USERID: " + user_id)

    // Make SQL query to get rows
    pgHelper.insertUser(user_id, premium, name, refresh_token, function (rows) {
        console.log("*******************************************\n");
        console.log("In the insert user callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}