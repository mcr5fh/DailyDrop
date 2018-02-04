const pgHelper = require("pgHelper.js")

exports.getAllInfoForGroup = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgHelper.getAllInfoForGroup(groupId, function (rows) {
        res.json(rows);
    })
}

exports.getSubmissionsInGroup = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgHelper.getSubmissionsInGroup(groupId, function (rows) {
        res.json(rows);
    })
}

exports.getUsersInGroup = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgHelper.getUsersInGroup(groupId, function (rows) {
        res.json(rows);
    })
}

exports.insertGroup = function (req, res) {
    const userId = req.body.creator_user_id;
    const groupName = req.body.name;
    const description = req.body.description;

    // Make SQL query to get rows
    pgHelper.insertGroup(groupName, userId, description, function (rows) {
        //transform
        res.json(rows);
    })
}

exports.updateGroup = function (req, res) {
    const groupId = req.params.group_id;
    const groupName = req.body.name;
    const description = req.body.description;

    // Make SQL query to get rows
    pgHelper.updateGroup(groupId, groupName, description, function (rows) {
        //transform
        res.json(rows);
    })
}