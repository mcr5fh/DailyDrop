'use strict';
var fs = require('fs');

const QUERY_FOLDER = 'sql/';
// const GET_ALL_INFO_FOR_GROUP_QUERY_PATH = QUERY_FOLDER + 'get_all_info_for_group.sql'
// const GET_ALL_INFO_FOR_GROUP_QUERY = fs.readFileSync(GET_ALL_INFO_FOR_GROUP_QUERY_PATH, 'utf8')
module.exports = Object.freeze({
    //We should also have one for on a date 
    // GET_SUBMISSIONS_IN_GROUP_ON_DATE_PATH: `GET_SUBMISSIONS_IN_GROUP_ON_DATE_PATH`, query string params
    GET_USER_INFO: `SELECT * FROM dailydrop.User WHERE user_id = $1`,
    GET_GROUP_INFO: `SELECT * FROM dailydrop.Group WHERE group_id = $1`,

    // GET_ALL_INFO_FOR_GROUP: GET_ALL_INFO_FOR_GROUP_QUERY,
    GET_SUBMISSIONS_IN_GROUP:
        `SELECT s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id, st.tag, s.date_added,
            COUNT(plays.submission_id)::integer as num_plays, 
            COUNT(votes.submission_id)::integer as num_votes
        FROM dailydrop.Submission as s 
        LEFT JOIN dailydrop.submission_vote as votes
            on s.submission_id = votes.submission_id 
        LEFT JOIN dailydrop.submission_play as plays
            on s.submission_id = plays.submission_id 
        LEFT OUTER JOIN dailydrop.submission_tag as st 
            on s.submission_id = st.submission_id 
        WHERE s.group_id = $1
        GROUP BY s.submission_id, st.tag;`,

    GET_SUBMISSIONS_IN_GROUP_TIME_BUCKET:
        `SELECT 
        (SELECT to_json(array_agg(row))
         FROM (SELECT
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT * 
                       FROM dailydrop.get_data_for_group($1,1,'num_plays')
                    LIMIT 10) row
             ) AS one_day,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,7,'num_plays')
                    LIMIT 10) row
             ) AS one_week,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,31,'num_plays')
                    LIMIT 10) row
             ) AS one_month,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,-1,'num_plays')
                    LIMIT 10) row
             ) AS all_time) row
        ) AS num_plays,
        (SELECT to_json(array_agg(row))
         FROM (SELECT
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT * 
                       FROM dailydrop.get_data_for_group($1,1,'num_votes')
                    LIMIT 10) row
             ) AS one_day,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,7,'num_votes')
                    LIMIT 10) row
             ) AS one_week,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,31,'num_votes')
                    LIMIT 10) row
             ) AS one_month,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,-1,'num_votes')
                    LIMIT 10) row
             ) AS all_time) row    ) AS num_votes,
        (SELECT to_json(array_agg(row))
         FROM (SELECT
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT * 
                       FROM dailydrop.get_data_for_group($1,1,'date_added')
                    LIMIT 10) row
             ) AS one_day,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,7,'date_added')
                    LIMIT 10) row
             ) AS one_week,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,31,'date_added')
                    LIMIT 10) row
             ) AS one_month,
             (SELECT COALESCE(to_json(array_agg(row)),'[]')
              FROM (SELECT *
                    FROM dailydrop.get_data_for_group($1,-1,'date_added')
                    LIMIT 10) row
             ) AS all_time) row
        ) AS date_added;`,
    // ORDER BY sm.num_plays DESC, sm.num_votes DESC;`,

    GET_USERS_IN_GROUP: `SELECT * 
                        FROM dailydrop.User as u 
                        JOIN dailydrop.Group_User AS gu on 
                        u.user_id = gu.user_id 
                        where gu.group_id = $1`,

    GET_TAG: `SELECT * FROM dailydrop.Submission_Tag 
              WHERE submission_id=$1;`,

    //Can drop the rToken column if we want
    INSERT_USER: `INSERT INTO dailydrop.User(user_id, premium, name, refresh_token) 
                VALUES($1, $2, $3, $4)
                RETURNING user_id, name, date_added;`,
    INSERT_USER_TO_GROUP: `INSERT INTO dailydrop.Group_User(user_id, group_id) 
                            VALUES($1, $2)
                            RETURNING user_id, group_id, date_added;`,
    INSERT_GROUP: `INSERT INTO dailydrop.Group(name, creator_user_id, description) 
                VALUES($1, $2, $3) 
                RETURNING group_id, date_added, name, creator_user_id, description;`,
    //We have to insert the submission id to the zscore table as well
    //We don't allow submission of the same song in the same group within 30 days
    INSERT_SUBMISSION:
        `WITH inserted_submission AS (
            INSERT INTO dailydrop.Submission(song_id, song_name, artist_name, user_id, group_id) 
            SELECT $1, $2, $3, $4, $5 
            WHERE NOT EXISTS (
                SELECT submission_id FROM dailydrop.Submission 
                WHERE group_id=$5 AND song_id =$1 
                AND age(now(),date_added) < dailydrop.allowed_duplicate_submission_time())
         RETURNING submission_id
        )
     INSERT INTO dailydrop.submission_zscore(submission_id)
     SELECT submission_id FROM inserted_submission
     RETURNING submission_id, last_updated as date_added;`,
    //     `WITH inserted_submission AS ( 
    //         INSERT INTO dailydrop.Submission(song_id, user_id, group_id, song_name, artist_name) 
    //       SELECT $1, $2, $3, $4, $5 
    //          WHERE NOT EXISTS ( 
    //              SELECT submission_id FROM dailydrop.Submission 
    //              WHERE group_id=$3 and song_id=$1 
    //              and age(now(),date_added) < dailydrop.allowed_duplicate_submission_time() 
    //          ) 
    //         RETURNING submission_id) 
    //     INSERT INTO dailydrop.submission_zscore(submission_id) 
    //         SELECT submission_id FROM inserted_submission 
    //     RETURNING submission_id, last_updated as date_added;`,
    INSERT_SUBMISSION_TO_ZSCORE: `INSERT INTO dailydrop.Submission_Zscore (submission_id) 
                VALUES ($1)
                RETURNING submission_id, last_updated;`,
    INSERT_PLAY: `INSERT INTO dailydrop.Submission_Play(submission_id, user_id) 
                VALUES ($1, $2) 
                RETURNING submission_id, user_id, date_added;`,
    INSERT_VOTE: `INSERT INTO dailydrop.Submission_Vote(submission_id, user_id) 
                VALUES ($1, $2) 
                RETURNING submission_id, user_id, date_added;`,
    INSERT_TAG: `INSERT INTO dailydrop.Submission_Tag(submission_id, tag) 
                VALUES ($1, $2) 
                ON CONFLICT(submission_id) DO UPDATE 
                SET tag = $2, date_added = now() 
                RETURNING submission_id, tag, date_added;`,

    //If result Row is non-exsistent, the result will contain zero rows
    //For now, we will let the person vote on their own submission
    UPDATE_GROUP: `UPDATE dailydrop.Group as g 
                        SET name = COALESCE($1,name), 
                        description = COALESCE($2,description) 
                        WHERE g.group_id=$3 
                        RETURNING group_id, name, description, creator_user_id, date_added;`,
    UPDATE_USER: `UPDATE dailydrop.User as u 
                        SET name = COALESCE($1,name), 
                        premium = COALESCE($2,premium), 
                        refresh_token = COALESCE($3,refresh_token) 
                        WHERE u.user_id=$4 
                        RETURNING user_id, name, premium, refresh_token, date_added;`,
    /**********************************************************************************
     * TRENDING ANALYTICS QUERIES
     * Queries to calculate and update the trending zscores for the submissions
     **********************************************************************************
     */
    //Note that the order matters for this transaction
    TRENDING_ZSCORE_TRANSACTION: [
        this.UPDATE_ZSCORE_FIELDS,
        this.CACLULATE_ZSCORE,
        this.UPDATE_NUM_PLAYS_PREDICTION,
        this.UPDATE_NUM_PLAYS_YESTERDAY],

    //If its the first calculation for an entry, we will set the average to the num_plays
    // and the trend to 0 (no slope). We will set zscore to 0 on the first calculation
    //if num_plays_yest is NULL (default value), z_score will be NULL (default) as well


    //--self.avg = self.alpha * value + (1 - self.alpha) * (self.avg + self.trend)
    //--self.sqrAvg = self.sqrAvg * (1 - self.alpha) +  (value ** 2) * (self.alpha)
    //--self.trend = self.beta * (avg - lastAvg) + (1 - self.beta) * self.trend
    //This needs a better name
    //We can use avg in the trend calculation since that is actually the last_avg and hasn`t been updated 
    UPDATE_ZSCORE_FIELDS:
        `WITH num_plays_today AS(SELECT submission_id, COUNT(submission_id) as count
                                FROM dailydrop.submission_play
                                WHERE date(date_added) >= date(current_timestamp)
                                GROUP BY submission_id), 
            new_avg AS (SELECT dailydrop.smoothing_alpha() * COALESCE(num_plays_today.count,0) + 
                            (1 - dailydrop.smoothing_alpha()) * (s.avg + s.trend) as value, s.submission_id 
                        FROM dailydrop.Submission_zscore AS s 
                        LEFT OUTER JOIN num_plays_today ON s.submission_id = num_plays_today.submission_id) 
        UPDATE dailydrop.Submission_zscore as score

        SET avg = COALESCE(new_avg.value, num_plays_today.count, 0),
            sqr_avg = COALESCE(
                        sqr_avg * (1 - dailydrop.smoothing_alpha()) + 
                        (COALESCE(num_plays_today.count,0) ^ 2) * dailydrop.smoothing_alpha(),
                        (COALESCE(num_plays_today.count,0) ^ 2), 0),
            trend = COALESCE(
                        dailydrop.smoothing_beta() * (new_avg.value - avg) + (1 - dailydrop.smoothing_beta()) * trend,
                        0),
            last_updated = now()
        FROM new_avg as new_avg
        LEFT OUTER JOIN num_plays_today as num_plays_today 
        ON num_plays_today.submission_id = new_avg.submission_id 
        WHERE score.submission_id = new_avg.submission_id;`,
    //if num_plays_yest is null, z_score will be as well
    CACLULATE_ZSCORE:
        `WITH num_plays_today AS(SELECT submission_id, COUNT(submission_id) as count
                                FROM dailydrop.submission_play
                                WHERE date(date_added) >= date(current_timestamp)
                                GROUP BY submission_id),
        sumbissions AS (SELECT submission_id FROM dailydrop.submission) 
        UPDATE dailydrop.Submission_zscore as score
        SET 
            last_updated = now(),
            z_score = 
            CASE 
                WHEN z_score IS NULL THEN 
                --On the first zscore calculation we'll set it to 0
                    0.0
                WHEN SQRT(ABS(sqr_avg - avg^2)) != 0 THEN 
                    (COALESCE(num_plays_today.count,0) - avg) / SQRT(abs(sqr_avg - avg^2))
                ELSE 
                    (COALESCE(num_plays_today.count,0) - avg) 
            END
        FROM sumbissions as subs
        LEFT JOIN num_plays_today as num_plays_today
        ON num_plays_today.submission_id = subs.submission_id
        WHERE score.submission_id = subs.submission_id;`,
    //Update the prediction based on the new data
    UPDATE_NUM_PLAYS_PREDICTION:
        `UPDATE dailydrop.Submission_zscore
            SET prediction = (avg + trend)::int,
            last_updated = now();`,
    //--Update num_plays_yesterday since we have processed that data
    UPDATE_NUM_PLAYS_YESTERDAY:
        `UPDATE dailydrop.Submission_zscore
            SET num_plays_yest = num_plays,
            last_updated = now();`
});

//May want this later?
// GET_USERS_THAT_VOTED_ON_DATE:
//     sqlQuery = `SELECT * FROM dailydrop.Submission 
// 				WHERE age(date $1, submission_time) - interval `1 day` < interval `1 day``;
