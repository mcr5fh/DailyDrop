const Errors = require("../constants/errors.js")

const groups = require("./groups.js")
const users = require("./users.js")
const submissions = require("./submissions.js")
const analytics = require("./analytics.js")

//Spy on the request so we can print it to our logs and catch our exceptions
function route(req, res, func) {
    console.log(req);
    try {
        func(req, res);
    } catch (e) {
        if (e instanceof Errors.BadRequestError) {
            var errorMessage = "Bad User Request. " + e.message + "\n" + e.error.stack;
            console.log(errorMessage);
            res.status(Errors.BAD_REQUEST_RESPONSE_CODE);
            res.send(errorMessage);
        } else {
            console.log("Caught internal exception: " + e.message);
            console.log(e.stack);
            res.status(Errors.BAD_REQUEST_RESPONSE_CODE);
            res.send("Caught internal exception: " + e.message);
        }
    }
}

// Groups
exports.getUsersInGroup = (req, res) => route(req, res, groups.getUsersInGroup);
exports.getSubmissionsInGroup = (req, res) => route(req, res, groups.getSubmissionsInGroup);
exports.getAllInfoForGroup = (req, res) => route(req, res, groups.getAllInfoForGroup);
exports.getAllInfoForGroupSorted = (req, res) => route(req, res, groups.getAllInfoForGroupSorted);
exports.insertGroup = (req, res) => route(req, res, groups.insertGroup);
exports.updateGroup = (req, res) => route(req, res, groups.updateGroup);
// Users
exports.getUserInfo = (req, res) => route(req, res, users.getUserInfo);
exports.insertUser = (req, res) => route(req, res, users.insertUser);
exports.updateUser = (req, res) => route(req, res, users.updateUser);
exports.addUserToGroup = (req, res) => route(req, res, users.addUserToGroup);
//Submissions
exports.insertSubmission = (req, res) => route(req, res, submissions.insertSubmission);
exports.addVoteToSubmission = (req, res) => route(req, res, submissions.addVoteToSubmission);
exports.addPlayToSubmission = (req, res) => route(req, res, submissions.addPlayToSubmission);

exports.addTagToSubmission = (req, res) => route(req, res, submissions.addTagToSubmission);
exports.getSubmissionTag = (req, res) => route(req, res, submissions.getSubmissionTag);

//Analytics
exports.calculateTrendingAnalytics = (req, res) => route(req, res, analytics.calculateTrendingAnalytics);