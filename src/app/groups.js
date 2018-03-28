const pgController = require("../postgres/groupsPgController.js")

exports.getAllInfoForGroup = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgController.getAllInfoForGroup(groupId, function (rows) {
        res.json(rows);
    })
}

exports.getAllInfoForGroupSorted = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgController.getAllInfoForGroupSorted(groupId, function (rows) {
        res.json(rows);
    })
}

exports.getSubmissionsInGroup = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgController.getSubmissionsInGroup(groupId, function (rows) {
        res.json(rows);
    })
}

exports.getUsersInGroup = function (req, res) {
    // Get user id from params
    const groupId = req.params.group_id

    // Make SQL query to get rows
    pgController.getUsersInGroup(groupId, function (rows) {
        res.json(rows);
    })
}

exports.insertGroup = function (req, res) {
    const userId = req.body.creator_user_id;
    const groupName = req.body.name;
    const description = req.body.description;

    // Make SQL query to get rows
    pgController.insertGroup(groupName, userId, description, function (rows) {
        //transform
        res.json(rows);
    })
}

exports.updateGroup = function (req, res) {
    const groupId = req.params.group_id;
    const groupName = req.body.name;
    const description = req.body.description;

    // Make SQL query to get rows
    pgController.updateGroup(groupId, groupName, description, function (rows) {
        //transform
        res.json(rows);
    })
}