'use strict';
var fs = require("fs");

const QUERY_FOLDER = 'sql/';
const GET_ALL_INFO_FOR_GROUP_QUERY_PATH = QUERY_FOLDER + "get_all_info_for_group.sql"
const GET_ALL_INFO_FOR_GROUP_QUERY = fs.readFileSync(GET_ALL_INFO_FOR_GROUP_QUERY_PATH, 'utf8')
module.exports = Object.freeze({
    //We should also have one for on a date 
    // GET_SUBMISSIONS_IN_GROUP_ON_DATE_PATH: 'GET_SUBMISSIONS_IN_GROUP_ON_DATE_PATH', query string params
    GET_USER_INFO: 'SELECT * FROM dailydrop.User WHERE user_id = $1',
    GET_GROUP_INFO: 'SELECT * FROM dailydrop.Group WHERE group_id = $1',

    // GET_ALL_INFO_FOR_GROUP: GET_ALL_INFO_FOR_GROUP_QUERY,
    GET_SUBMISSIONS_IN_GROUP: "SELECT s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id,  sm.num_votes, \
                                    sm.num_plays, st.tag, sm.trending_rate, sm.popular_rate, s.date_added \
                                FROM dailydrop.Submission as s \
                                LEFT OUTER JOIN dailydrop.Submission_Metrics as sm \
                                    on s.submission_id = sm.submission_id \
                                LEFT OUTER JOIN dailydrop.submission_tag as st \
                                    on s.submission_id = st.submission_id \
                                WHERE s.group_id = $1 \
                                ORDER BY sm.num_plays DESC, sm.num_votes DESC;",

    GET_USERS_IN_GROUP: "SELECT * \
                        FROM dailydrop.User as u \
                        JOIN dailydrop.Group_User AS gu on \
                        u.user_id = gu.user_id \
                        where gu.group_id = $1",

    GET_TAG: 'SELECT * FROM dailydrop.Submission_Tag \
              WHERE submission_id=$1;',

    //Can drop the rToken column if we want
    INSERT_USER: 'INSERT INTO dailydrop.User(user_id, premium, name, refresh_token) \
                VALUES($1, $2, $3, $4) \
                ON CONFLICT (user_id) DO UPDATE \
                SET premium = $2, name = $3, refresh_token = $3 \
                RETURNING user_id, name, date_added;',
    INSERT_GROUP: 'INSERT INTO dailydrop.Group(name, creator_user_id, description) \
                VALUES($1, $2, $3) \
                RETURNING group_id, date_added, name, creator_user_id, description;',
    INSERT_SUBMISSION: 'INSERT INTO dailydrop.Submission (song_id, song_name, artist_name, user_id, group_id) \
                VALUES ($1, $2, $3, $4, $5) \
                RETURNING submission_id, song_id, user_id, group_id, submission_time;',
    INSERT_PLAY: 'INSERT INTO dailydrop.Submission_Play(submission_id, user_id) \
                VALUES ($1, $2) \
                RETURNING submission_id, user_id, date_added;',
    INSERT_VOTE: 'INSERT INTO dailydrop.Submission_Vote(submission_id, user_id) \
                VALUES ($1, $2) \
                RETURNING submission_id, user_id, date_added;',
    INSERT_TAG: 'INSERT INTO dailydrop.Submission_Tag(submission_id, tag) \
                VALUES ($1, $2) \
                ON CONFLICT(submission_id) DO UPDATE \
                SET tag = $2, , date_added = now() \
                RETURNING submission_id, tag, date_added;',

    //If result Row is non-exsistent, the result will contain zero rows
    //For now, we will let the person vote on their own submission
    ADD_VOTE_TO_SUBMISSION: "UPDATE dailydrop.Submission_Metrics as s \
                        SET num_votes = num_votes + 1, \
                        last_updated = now() \
                        WHERE s.submission_id=$1 \
                        RETURNING num_votes;",
    ADD_PLAY_TO_SUBMISSION: "UPDATE dailydrop.Submission_Metrics as s \
                        SET num_plays = num_plays + 1, \
                        last_updated = now() \
                        WHERE s.submission_id=$1 \
                        RETURNING num_plays;",
    UPDATE_GROUP: "UPDATE dailydrop.Group as g \
                        SET name = $1, \
                        description = $2 \
                        WHERE g.group_id=$3 \
                        RETURNING group_id, name, description, creator_user_id, date_added;",
    UPDATE_USER: "UPDATE dailydrop.User as u \
                        SET name = $1, \
                        premium = $2, \
                        refresh_token = $3 \
                        WHERE u.user_id=$4 \
                        RETURNING user_id, name, premium, refresh_token, date_added;"
});

//May want this later?
// GET_USERS_THAT_VOTED_ON_DATE_PATH:
//     sqlQuery = "SELECT * FROM dailydrop.Submission \
// 				WHERE age(date $1, submission_time) - interval '1 day' < interval '1 day'";