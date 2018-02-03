const pgHelper = require("pgHelper.js")

exports.getAllInfoForGroup = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgHelper.getAllInfoForGroup(groupId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the users callback!");
        console.log(rows);
        //This is where we will do the mapping/parsing
        //transform
        res.json(rows);
    })
}

exports.insertGroup = function (req, res) {
    const userId = req.body.creator_user_id;
    const groupName = req.body.name;
    console.log("insert group USERID: " + userId)
    console.log("insert group GROUP NAME: " + groupName)

    // Make SQL query to get rows
    pgHelper.insertGroup(groupName, userId, function (rows) {
        console.log("In the insert group callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}