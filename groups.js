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