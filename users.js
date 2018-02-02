const pgHelper = require("pgHelper.js")

exports.getUserInfo = function (req, res) {
    // Get user id from params
    const userId = req.params.user_id

    // Make SQL query to get rows
    pgHelper.getUserInfo(userId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the users callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.insertUser = function (req, res) {
    // Get user id from params
    console.log("*******************************")
    console.log(req)
    // var req_body = JSON.parse(req.body);
    // console.log(req_body)
    const user_id = req.body.user_id;
    console.log("USERID: " + user_id)
    console.log("OR ____ USERID: " + req.body["user_id"])
    const premium = req.body.premium;
    const name = req.body.name;

    //Actually don't need refresh token anymore

    // Make SQL query to get rows
    pgHelper.insertUser(user_id, premium, name, function (rows) {
        console.log("*******************************************\n");
        console.log("In the insert user callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}