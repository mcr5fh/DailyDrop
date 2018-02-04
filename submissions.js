const pgHelper = require("pgHelper.js")

exports.insertSubmission = function (req, res) {
    const songId = req.body.song_id;
    const userId = req.body.user_id;
    const groupId = req.body.group_id;
    const songName = req.body.song_name;
    const artistName = req.body.artist_name;
    console.log("Inserting song ", songId, "in group ", groupId, "from user", userId);

    // Make SQL query to get rows
    pgHelper.insertSubmission(songId, userId, groupId, songName, artistName, function (rows) {
        console.log("*******************************************\n");
        console.log("In the insert sub callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.addVoteToSubmission = function (req, res) {
    const submissionId = req.params.submission_id;
    const userId = req.body.user_id;
    // const groupId = req.body.group_id;
    console.log(req);
    console.log("Voting on ", submissionId);

    // Make SQL query to get rows
    pgHelper.addVoteToSubmission(submissionId, userId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the vote on sub callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}

exports.addPlayToSubmission = function (req, res) {
    const submissionId = req.params.submission_id;
    const userId = req.body.user_id;
    // const groupId = req.body.group_id;
    console.log("Adding play on ", submissionId);//, "in group ", groupId);

    // Make SQL query to get rows
    pgHelper.addPlayToSubmission(submissionId, userId, function (rows) {
        console.log("*******************************************\n");
        console.log("In the add play on sub callback!");
        console.log(rows);
        //transform
        res.json(rows);
    })
}
