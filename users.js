const pgHelper = require("pgHelper.js")

exports.getUserInfo = function (req, res) {
    // Get user id from params
    const userId = req.params.user_id
    // res.send("Not going crazy: " + userId);

    // Make SQL query to get rows
    var rows = pgHelper.getUserInfo(userId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the users callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
    // // Return formatted JSON via res object
    //     res.send(rows)
}