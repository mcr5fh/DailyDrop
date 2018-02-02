const groups = require("groups.js")
const users = require("users.js")
const submissions = require("submissions.js")

// Groups
exports.getAllInfoForGroup = groups.getAllInfoForGroup
// Users
exports.getUserInfo = users.getUserInfo
exports.insertUser = users.insertUser

//Submissions
exports.insertSubmission = submissions.insertSubmission
exports.voteOnSubmission = submissions.voteOnSubmission
