const pgHelper = require("pgHelper.js")

exports.insertSubmission = function (req, res) {
    const songId = req.body.song_id;
    const userId = req.body.user_id;
    const groupId = req.body.group_id;

    // Make SQL query to get rows
    pgHelper.insertSubmission(songId, userId, groupId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the insert sub callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.voteOnSubmission = function (req, res) {
    const songId = req.body.song_id;
    const groupId = req.body.group_id;

    // Make SQL query to get rows
    pgHelper.voteOnSubmission(songId, groupId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the vote on sub callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}
