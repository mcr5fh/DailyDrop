const pgController = require("../postgres/analyticsPgController.js")

//We don't have to pass anything to this, since its running against all of our data
exports.calculateTrendingAnalytics = function (req, res) {
    pgController.calculateTrendingAnalytics(function (rows) {
        res.json(rows);
    })
}