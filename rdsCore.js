'use strict';
var fs = require("fs");

const QUERY_FOLDER = 'SqlQueries/';
const GET_ALL_INFO_FOR_GROUP_QUERY_PATH = QUERY_FOLDER + "get_all_info_for_group.sql"
const GET_ALL_INFO_FOR_GROUP_QUERY = fs.readFileSync(GET_ALL_INFO_FOR_GROUP_QUERY_PATH, 'utf8')
module.exports = Object.freeze({
    // exports.GET_SUBMISSIONS_IN_GROUP_PATH = 'GET_SUBMISSIONS_IN_GROUP_PATH'
    // exports.GET_SUBMISSIONS_IN_GROUP_QUERY = ''
    //We should also have one for on a date 
    // GET_SUBMISSIONS_IN_GROUP_ON_DATE_PATH: 'GET_SUBMISSIONS_IN_GROUP_ON_DATE_PATH',
    // GET_USERS_IN_GROUP_PATH: 'GET_USERS_IN_GROUP_PATH',
    GET_USER_INFO: 'SELECT * FROM dailydrop.User WHERE user_id = $1',

    // GET_ALL_GROUP_INFO_FOR_USER_PATH: 'GET_ALL_GROUP_INFO_FOR_USER_PATH',
    // GET_ALL_GROUP_INFO_FOR_USER_QUERY: QUERY_FOLDER + 'get_all_group_info_for_user.sql',
    GET_ALL_INFO_FOR_GROUP: GET_ALL_INFO_FOR_GROUP_QUERY,
    GET_SUBMISSIONS_IN_GROUP: "SELECT * \
                FROM dailydrop.submission \
                WHERE dailydrop.submission.group_id = $1",

    GET_USERS_IN_GROUP: "SELECT * \
                        FROM dailydrop.User as u \
                        JOIN dailydrop.Group_User AS gu on \
                        u.user_id = gu.user_id \
                        where gu.group_id = $1",

    // //should be something like this
    // GET_USERS_THAT_VOTED_ON_DATE_PATH: 'GET_USERS_THAT_VOTED_ON_DATE_PATH',
    //Can drop the rToken column when we want
    INSERT_USER: 'INSERT INTO dailydrop.User(user_id, premium, name) \
                VALUES($1, $2, $3) \
                RETURNING user_id, name;',
    INSERT_SUBMISSION: 'INSERT INTO dailydrop.Submission (song_id, user_id, group_id, submission_time, num_votes) \
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0) \
                RETURNING song_id, user_id,submission_time, num_votes;',
    //If result Row is non-exsistent, the result will contain zero rows
    //For now, we will let the person vote on their own submission
    VOTE_ON_SUBMISSION: "UPDATE dailydrop.Submission as s \
                        SET num_votes = num_votes + 1 \
                        WHERE s.song_id=$1 \
                        AND s.group_id=$2 \
                        RETURNING num_votes;"
});

// INSERT_GROUP_PATH: 'INSERT_GROUP_PATH',
// 

// INSERT_WINNER_OF_THE_DAY_QUERY: QUERY_FOLDER + 'get_winner_of_the_day.sql',

// VOTE_ON_SUBMISSION_PATH: 'VOTE_ON_SUBMISSION_PATH'
// });

exports.getSqlQuery = function (queryEnum) {
    console.log("Query: " + queryEnum);
    //MOVE THIS ALL to THE ENUMS


    //Don't have to check GET/POST becuase API gateway will take care of that
    switch (resourcePath) {
        /*
         * Gets
         */
        case GET_SUBMISSIONS_IN_GROUP_PATH:
            sqlQuery = "SELECT song_id, user_id, group_id, submission_time, num_votes \
						FROM  dailydrop.Submission \
						WHERE group_id=$1 ";
            break;
        case GET_USERS_IN_GROUP_PATH:
            sqlQuery = "SELECT dailydrop.User.user_id, premium, name, refresh_token FROM dailydrop.User \
						JOIN dailydrop.Group_User on \
						dailydrop.User.user_id = dailydrop.Group_User.user_id \
						WHERE group_id=$1;";
            break;
        case GET_ALL_GROUP_INFO_FOR_USER_PATH:
            sqlQuery = fs.readFileSync(GET_ALL_GROUP_INFO_FOR_USER_QUERY, 'utf8');
            break;

        case GET_USERS_THAT_VOTED_ON_DATE_PATH:
            sqlQuery = "SELECT * FROM dailydrop.Submission \
						WHERE age(date $1, submission_time) - interval '1 day' < interval '1 day'";
        /*
         * Inserts
         */
        case INSERT_GROUP_PATH:
            //Removed for debugging purposes ON CONFLICT (group_id) DO NOTHING \
            sqlQuery = 'INSERT INTO dailydrop.Group(group_id, name, Vote_time, submission_time) \
						VALUES($1, $2, $3, $4) \
						RETURNING group_id, name,  Vote_time, submission_time;';
            break;
            // case INSERT_SUBMISSION_PATH:
            //     sqlQuery = "INSERT INTO dailydrop.Submission (song_id, user_id, group_id, submission_time, num_votes) \
            // 				VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0) \
            // 				RETURNING song_id, user_id,submission_time, num_votes;";
            break;
            /*
             * Updates
             * TODO : is this a POST or GET?
             */

            break;
    }

    //Add to json format to the response 
    // sqlQuery = "select array_agg(row) from (" + sqlQuery + ") row";
    return sqlQuery;
};
