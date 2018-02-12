const groups = require("./groups.js")
const users = require("./users.js")
const submissions = require("./submissions.js")

function route(req, res, func) {
    console.log(req);
    func(req, res);
}

// Groups
exports.getUsersInGroup = (req, res) => route(req, res, groups.getUsersInGroup);
exports.getSubmissionsInGroup = (req, res) => route(req, res, groups.getSubmissionsInGroup);
exports.getAllInfoForGroup = (req, res) => route(req, res, groups.getAllInfoForGroup);
exports.insertGroup = (req, res) => route(req, res, groups.insertGroup);
exports.updateGroup = (req, res) => route(req, res, groups.updateGroup);

// Users
exports.getUserInfo = (req, res) => route(req, res, users.getUserInfo);
exports.insertUser = (req, res) => route(req, res, users.insertUser);
exports.updateUser = (req, res) => route(req, res, users.updateUser);

//Submissions
exports.insertSubmission = (req, res) => route(req, res, submissions.insertSubmission);
exports.addVoteToSubmission = (req, res) => route(req, res, submissions.addVoteToSubmission);
exports.addPlayToSubmission = (req, res) => route(req, res, submissions.addPlayToSubmission);

exports.addTagToSubmission = (req, res) => route(req, res, submissions.addTagToSubmission);
exports.getSubmissionTag = (req, res) => route(req, res, submissions.getSubmissionTag);