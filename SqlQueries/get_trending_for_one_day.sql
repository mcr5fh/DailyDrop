SELECT play.submission_id, submission.song_name, submission.artist_name, COUNT(play.submission_id) as c 
FROM dailydrop.submission_play as play
JOIN dailydrop.submission as submission ON play.submission_id = submission.submission_id
WHERE date(play.date_added) > date(current_timestamp) - 1
GROUP BY play.submission_id, submission.song_name, submission.artist_name ORDER BY c DESC LIMIT 3;
