const groups = require("groups.js")
const users = require("users.js")
const submissions = require("submissions.js")

// Groups
exports.getUsersInGroup = groups.getUsersInGroup
exports.getSubmissionsInGroup = groups.getSubmissionsInGroup
exports.getAllInfoForGroup = groups.getAllInfoForGroup
exports.insertGroup = groups.insertGroup
exports.updateGroup = groups.updateGroup

// Users
exports.getUserInfo = users.getUserInfo
exports.insertUser = users.insertUser

//Submissions
exports.insertSubmission = submissions.insertSubmission
exports.addVoteToSubmission = submissions.addVoteToSubmission
exports.addPlayToSubmission = submissions.addPlayToSubmission
