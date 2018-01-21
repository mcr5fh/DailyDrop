INSERT INTO dailydrop.winner 
(SELECT song_id, user_id, group_id, submission_time, num_votes 
FROM dailydrop.submission
WHERE age(now(), Submission_Time) - interval '1 day' < interval '1 day'
AND num_votes = (SELECT MAX(num_votes)  
                   FROM dailydrop.submission
                   WHERE age(now(), Submission_Time) - interval '1 day' < interval '1 day'))
RETURNING song_id, user_id, group_id, submission_time, num_votes;
