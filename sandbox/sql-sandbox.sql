--SELECT g.GroupId, Name, VoteTime, SubmissionTime FROM dailydrop.Group AS g JOIN dailydrop.Group_User AS gu on gu.GroupId = g.GroupId WHERE gu.UserId='TestUser3';,
delete from dailydrop.Winner;

--this will work
--select array_agg(row) from (select * from dailydrop.submission) row;
delete from dailydrop.User;
INSERT INTO dailydrop.User(user_id, premium, name, refresh_token) VALUES
                        ('TestUser1', true, 'Tooters','rtoken1'),
						('TestUser2', true, 'Aubs','rtoken2'),
						('TestUser3', false, 'Blork','rtoken3');
delete from dailydrop.Group;
--only adding group_id for testing purposes
INSERT INTO dailydrop.Group(name, creator_user_id, group_id) VALUES
                        ('Gimme some MJ', 'TestUser1', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('Bang my head', 'TestUser2', '4cccf9ee-1633-4cbb-b926-46284219e9cc');
INSERT INTO dailydrop.Group(name, creator_user_id) VALUES
                        ('Just added', 'TestUser3');
--CREATE TABLE dailydrop.Group_User_test(user_id TEXT, group_id uuid, date_added timestamp without time zone,  PRIMARY KEY(user_id, group_id));
delete from dailydrop.Group_User;
INSERT INTO dailydrop.Group_User(user_id, group_id) VALUES
                        ('TestUser1', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('TestUser2', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('TestUser3', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc'),
                        ('TestUser3', '4cccf9ee-1633-4cbb-b926-46284219e9cc');
--Reset Submission playlisy
delete from dailydrop.submission;
INSERT INTO dailydrop.Submission(song_id, user_id, group_id, song_name,artist_name) VALUES
		('Dong69', 'TestUser3', '58c19e8a-98a0-46be-b94f-68f08c3ab82d', 'Dirty Diana', 'MJ'),
		('Dong70', 'TestUser2', '58c19e8a-98a0-46be-b94f-68f08c3ab82d', 'Cant get enough', 'MJ'),
		('Dong73', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger1', '2F'),
		('Dong1213', 'TestUser3', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger2', '3F'),
		('New_Song', 'TestUser2', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger3', 'MJ'),
		('New_New_song', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger5', '5F');
		
		
		UPDATE dailydrop.Submission as s 
                        SET num_votes = num_votes + 1 
                        WHERE s.song_id='Dong69' 
                        AND s.group_id= '58c19e8a-98a0-46be-b94f-68f08c3ab82d'
                        RETURNING num_votes;



select * from dailydrop.submission order by num_plays desc, num_votes desc;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO dailydrop.Submission(song_id, user_id, group_id, song_name, artist_name, submission_id) VALUES
        ('Played Song 1', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Forget 2 friends I have 5', '5F', 'a1ef3cd9-1a42-4f3f-90a7-b8760edbac4f'),
        ('Played Song 2', 'TestUser2', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Tiesto Cranks', 'Tiesto', '2bca6d38-617f-4f9b-905b-f695ab8943c2');


--better way for num plays?
SELECT play.submission_id, submission.song_name, submission.artist_name, COUNT(play.submission_id)  as c 
FROM dailydrop.submission_play as play
JOIN dailydrop.submission as submission ON play.submission_id = submission.submission_id
WHERE date(play.date_added) > date(current_timestamp) - 1
GROUP BY play.submission_id, submission.song_name, submission.artist_name ORDER BY c DESC LIMIT 3;


INSERT INTO dailydrop.submission_play(submission_id, user_id) VALUES
        ('2bca6d38-617f-4f9b-905b-f695ab8943c2', 'TestUser3');
		('0b6a3d91-ae0b-4c2d-b501-548d8c3b23d7', 'TestUser1');

WITH inserted_submission AS (
   INSERT INTO dailydrop.Submission(song_id, user_id, group_id, song_name, artist_name) 
        SELECT 'Played Song 1', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Forget 2 friends I have 5', '5F'
		WHERE NOT EXISTS (
			SELECT submission_id FROM dailydrop.Submission 
			WHERE group_id='4cccf9ee-1633-4cbb-b926-46284219e9cc' and song_id = 'Played Song 1'
			and age(now(),date_added) < dailydrop.allowed_duplicate_submission_time()
		)
	RETURNING submission_id
   )
INSERT INTO dailydrop.submission_zscore(submission_id)
SELECT submission_id FROM inserted_submission
RETURNING *; 

CREATE OR REPLACE FUNCTION dailydrop.allowed_duplicate_submission_time()
  RETURNS interval IMMUTABLE LANGUAGE SQL AS
$$SELECT interval '30 day'$$;



create or replace function dailydrop.get_data_for_group(
      group_uuid uuid,
      num_days integer,
      sort_column text,
) returns setof record 
-- no returns clause necessary, output structure controlled by OUT parameters
-- returns XXX
as $BODY$
begin
   SELECT INTO submission_id, song_id, song_name, artist_name, submitted_by,  
    num_votes, num_plays, date_added
    s.submission_id submission_id, s.song_id, s.song_name, s.artist_name, s.user_id,  
    sm.num_votes, sm.num_plays, s.date_added

    FROM dailydrop.Submission as s 
    LEFT JOIN dailydrop.Submission_Metrics as sm 
        on s.submission_id = sm.submission_id 
    WHERE s.group_id = group_uuid
    and age(now(), s.date_added) < num_days * interval '1 day'
    ORDER BY quote_ident(sort_column)  DESC
    LIMIT 10;
    -- no return statement necessary, output values already stored in OUT parameters
end
$BODY$ language plpgsql;



INSERT INTO dailydrop.submission_tag(submission_id, tag) VALUES
        ('2bca6d38-617f-4f9b-905b-f695ab8943c2', 'Popular'),
		('cd6b5fde-cf31-49ce-b4d2-988694ed9157', 'Popular'),
		('ed8c6fad-abfe-4b22-b7cf-9c2216fb7906', 'Popular'),
		('a1ef3cd9-1a42-4f3f-90a7-b8760edbac4f', 'Featured')
ON CONFLICT (submission_id) DO NOTHING
--SET tag = 'Featured', date_added = now()
RETURNING submission_id, tag, date_added;

		('0b6a3d91-ae0b-4c2d-b501-548d8c3b23d7', 'Popular');
INSERT INTO dailydrop.submission_vote(submission_id, user_id) VALUES
        ('2bca6d38-617f-4f9b-905b-f695ab8943c2', 'TestUser2'),
		('0b6a3d91-ae0b-4c2d-b501-548d8c3b23d7', 'TestUser1');
		
INSERT INTO dailydrop.submission_metrics(submission_id, num_plays, num_votes) VALUES
        ('2bca6d38-617f-4f9b-905b-f695ab8943c2', 3, 5),
		('0b6a3d91-ae0b-4c2d-b501-548d8c3b23d7', 1, 8),
		('ed8c6fad-abfe-4b22-b7cf-9c2216fb7906', 5, 10);

INSERT INTO dailydrop.Submission(song_id, user_id, group_id, song_name, artist_name) VALUES
        ('Played Song 3', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Forget 5 friends I have 10', '10F'),
        ('Played Song 4', 'TestUser2', 'b2979559-d870-4128-8241-7e1cafad0acd', 'Tiesto Cranks', 'Tiesto')
;
d2952196-7043-4658-aefe-2697af472637;


--geting rid of tags for now
SELECT s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id as submitted_by,  sm.num_votes, sm.num_plays, st.tag, z.z_score, s.date_added
FROM dailydrop.Submission as s
LEFT OUTER JOIN dailydrop.Submission_Metrics as sm
on s.submission_id = sm.submission_id 
LEFT OUTER JOIN dailydrop.submission_tag as st
on s.submission_id = st.submission_id 
LEFT OUTER JOIN dailydrop.submission_zscore as z
on s.submission_id = z.submission_id 
WHERE s.group_id ='4cccf9ee-1633-4cbb-b926-46284219e9cc' --AND st.tag IS NOT NULL
ORDER BY st.tag DESC, z.z_score DESC, s.date_added DESC;



--recent - last updated
SELECT s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id as submitted_by,  
	sm.num_votes, sm.num_plays, s.date_added
FROM dailydrop.Submission as s 
LEFT JOIN dailydrop.Submission_Metrics as sm 
    on s.submission_id = sm.submission_id 
WHERE s.group_id = '4cccf9ee-1633-4cbb-b926-46284219e9cc'
and age(now(), date_added) < interval '1 day'
ORDER BY date_added DESC
LIMIT 10;

CREATE OR REPLACE FUNCTION dailydrop.smoothing_alpha(group_id uuid, num_days integer)
  RETURNS float4 IMMUTABLE LANGUAGE SQL AS
'SELECT 0.2::float4';

SELECT get_from_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',1,'date_added');

create or replace function get_from_group(
    IN  group_id uuid,
    IN  num_days integer,
    IN  sort_column text,

    OUT submission_id uuid,
     OUT song_id text,
     OUT song_name text,
     OUT artist_name text,
     OUT submitted_by text,
     OUT num_votes integer,
     OUT num_plays integer,
     OUT date_added timestamp without time zone
)
-- no returns clause necessary, output structure controlled by OUT parameters
-- returns XXX
as $BODY$
begin
   SELECT INTO submission_id, song_id, song_name, artist_name, submitted_by,  
    num_votes, num_plays, date_added
    s.submission_id submission_id, s.song_id, s.song_name, s.artist_name, s.user_id,  
    sm.num_votes, sm.num_plays, s.date_added

    FROM dailydrop.Submission as s 
    LEFT JOIN dailydrop.Submission_Metrics as sm 
        on s.submission_id = sm.submission_id 
    WHERE s.group_id = group_id
    and age(now(), date_added) < interval '|| num_days || day'
    ORDER BY || quote_ident(sort_column) ||  DESC
    LIMIT 10;
    -- no return statement necessary, output values already stored in OUT parameters
end
$BODY$ language plpgsql;

--leaderboard - num votes (add field for time perdiod)
	--bucket  into plays & votes
	-- add day, week, month, all time (LIMIT 10)
--num plays
SELECT s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id as submitted_by,  
	sm.num_votes, sm.num_plays, s.date_added
FROM dailydrop.Submission as s 
LEFT JOIN dailydrop.Submission_Metrics as sm 
    on s.submission_id = sm.submission_id 
WHERE s.group_id = '4cccf9ee-1633-4cbb-b926-46284219e9cc'
and age(now(), date_added) < interval '91 day'
ORDER BY num_plays DESC
LIMIT 10;
--num votes
SELECT s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id as submitted_by,  
	sm.num_votes, sm.num_plays, s.date_added
FROM dailydrop.Submission as s 
LEFT JOIN dailydrop.Submission_Metrics as sm 
    on s.submission_id = sm.submission_id 
WHERE s.group_id = '4cccf9ee-1633-4cbb-b926-46284219e9cc'
and age(now(), date_added) < interval '91 day'
ORDER BY num_votes DESC
LIMIT 10;
--trending - z score - can't be bucketed
SELECT s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id as submitted_by,  sm.num_votes, sm.num_plays, z.z_score, s.date_added
FROM dailydrop.Submission as s
LEFT OUTER JOIN dailydrop.Submission_Metrics as sm
on s.submission_id = sm.submission_id 
LEFT OUTER JOIN dailydrop.submission_zscore as z
on s.submission_id = z.submission_id 
WHERE s.group_id ='4cccf9ee-1633-4cbb-b926-46284219e9cc'
ORDER BY z.z_score DESC, s.date_added DESC;

SELECT
    (SELECT to_json(array_agg(row))
     FROM (SELECT *
           FROM dailydrop.user t
           LIMIT 10) row ) AS top_users,
    (SELECT to_json(array_agg(row))
     FROM (SELECT *
           FROM dailydrop.submission) row
     ) AS subs;
     
     
---This works
--this is sick
SELECT
    (SELECT to_json(array_agg(row))
     FROM (SELECT
            (SELECT to_json(array_agg(row))
             FROM (SELECT *
                   FROM dailydrop.user t
                   LIMIT 10) row
            ) AS users,
            (SELECT to_json(array_agg(row))
             FROM (SELECT *
                   FROM dailydrop.group g
                   LIMIT 10) row
            ) AS groups) row
    ) AS top_level,
    (SELECT to_json(array_agg(row))
     FROM (SELECT *
           FROM dailydrop.submission) row
     ) AS subs;
---^^^----


---This works
SELECT
	(SELECT array_to_string(array_agg(g.group_id), ',')
		 	FROM dailydrop.Group AS g 
		 	JOIN dailydrop.Group_User AS gu on 
			gu.group_id = g.group_id 
			WHERE gu.user_id='RDS_Lambda_test_2'  
	) as g_ids,
	(SELECT to_json(array_agg(row))
     FROM (SELECT *
		 	FROM dailydrop.User as u 
			JOIN dailydrop.Group_User AS gu on 
			u.user_id = gu.user_id 
			where gu.group_id IN
				(SELECT g.group_id
			 	FROM dailydrop.Group AS g 
			 	JOIN dailydrop.Group_User AS gu on 
				gu.group_id = g.group_id 
				WHERE gu.user_id='RDS_Lambda_test_2')
			)
	 row
	)as users_in_group,
	(SELECT to_json(array_agg(row))
     FROM (SELECT *
		 	FROM dailydrop.submission 
			where dailydrop.submission.group_id IN
				(SELECT g.group_id
			 	FROM dailydrop.Group AS g 
			 	JOIN dailydrop.Group_User AS gu on 
				gu.group_id = g.group_id 
				WHERE gu.user_id='RDS_Lambda_test_2')
			)
	 row
	)as subs_in_group,
	(SELECT to_json(array_agg(row))
     FROM (SELECT *
		 	FROM dailydrop.winner 
			where dailydrop.winner.group_id IN
				(SELECT g.group_id
			 	FROM dailydrop.Group AS g 
			 	JOIN dailydrop.Group_User AS gu on 
				gu.group_id = g.group_id 
				WHERE gu.user_id='RDS_Lambda_test_2')
			)
	 row
	)as winners_in_group
	;
	
--	
----Testing
--SELECT g.Groupid
--			 	FROM dailydrop.Group AS g 
--			 	JOIN dailydrop.Group_User AS gu on 
--				gu.Groupid = g.Groupid 
--				WHERE gu.Userid='TestUser3' as gid
--
--select 
--	(SELECT to_json(array_agg(row))
--     FROM (SELECT *
--		 	FROM dailydrop.submission 
--			where dailydrop.submission.groupid IN
----				(SELECT array_to_string(array_agg(g.Groupid), ',')
--				gid)
--	 row
--	)as res
--	;
--	
--




SELECT COALESCE(num_plays - num_plays_yest, num_plays), submission_id
 FROM dailydrop.submission_metrics AS m;

select  COALESCE(
	dailydrop.smoothing_alpha() * (SELECT num_plays - num_plays_yest FROM dailydrop.submission_metrics AS m 
	WHERE m.submission_id = t.submission_id) + (1 - dailydrop.smoothing_alpha()) * (t.avg + t.trend), 
	(select num_plays^2 from dailydrop.submission_metrics AS m WHERE m.submission_id = t.submission_id))
from dailydrop.submission_zscore as t;

select COALESCE(dailydrop.smoothing_beta() * (t.avg - t.previous_avg) + (1 - dailydrop.smoothing_beta()) * t.trend, 0)
from dailydrop.submission_zscore as t;
--START TRENDING Z SCORE CALCULATIONS
-- value = SELECT num_plays - num_-plays_yest FROM submission_metrics AS m WHERE m.submission_id = s.submission_id;

-- Basically every update has to be done one after the other

BEGIN;
--Update the previous averag

WITH observation AS (SELECT submission_id, (num_plays - num_plays_yest) as plays FROM dailydrop.submission_metrics AS m),
--	 previous_avg AS (select COALESCE(avg,0) from dailydrop.Submission_zscore),
	 new_avg AS (SELECT
			dailydrop.smoothing_alpha() * observation.plays + (1 - dailydrop.smoothing_alpha()) * (s.avg + s.trend) as value, s.submission_id from dailydrop.Submission_zscore as s JOIN observation on s.submission_id = observation.submission_id) 
--			(select num_plays as value, submission_id from dailydrop.submission_metrics AS m WHERE m.submission_id = s.submission_id)) 
--			from dailydrop.Submission_zscore as s)
			
UPDATE dailydrop.Submission_zscore as score
----self.avg = self.alpha * value + (1 - self.alpha) * (self.avg + self.trend)
--SET avg = COALESCE(
--			dailydrop.smoothing_alpha() * observation.plays + (1 - dailydrop.smoothing_alpha()) * (score.avg + score.trend),
--			observation.plays)
SET avg = COALESCE(new_avg.value, observation.plays),
			
--self.sqrAvg = self.sqrAvg * (1 - self.alpha) +  (value ** 2) * (self.alpha)
sqr_avg = COALESCE(
			sqr_avg * (1 - dailydrop.smoothing_alpha()) + 
			(observation.plays ^ 2) * dailydrop.smoothing_alpha(),
			(observation.plays ^ 2)),
--self.trend = self.beta * (avg - lastAvg) + (1 - self.beta) * self.trend
trend = COALESCE(
			dailydrop.smoothing_beta() * (new_avg.value - avg) + (1 - dailydrop.smoothing_beta()) * trend,
			0),
last_updated = now()
FROM observation as observation
LEFT OUTER JOIN new_avg as new_avg 
on observation.submission_id = new_avg.submission_id 
where score.submission_id = observation.submission_id;
--COMMIT;
--ROLLBACK;

--std() = sqrt(abs(self.sqrAvg - self.avg ** 2))
--if self.std() == 0: z_score = obs - self.avg
--else: z_score = (value - self.avg) / self.std()
--if num_plays_yest is null, z_score will be as well
WITH observation AS (SELECT (num_plays - num_plays_yest) as plays, submission_id FROM dailydrop.submission_metrics)
UPDATE dailydrop.Submission_zscore as score
SET 
last_updated = now(),
z_score = 
CASE 
WHEN z_score IS NULL THEN 
	--On the first zscore calculation we'll set it to 0
	0.0
WHEN SQRT(ABS(sqr_avg - avg^2)) != 0 THEN 
	(obs.plays - avg) / SQRT(abs(sqr_avg - avg^2))
ELSE 
	(obs.plays - avg) 
END
FROM observation as obs
WHERE score.submission_id = obs.submission_id;
--COMMIT;

--UPDATE dailydrop.Submission_zscore as score
--SET z_score = (SELECT COALESCE(num_plays - num_plays_yest, num_plays) FROM dailydrop.submission_metrics AS m WHERE m.submission_id = score.submission_id) -
-- avg
--WHERE SQRT(abs(sqr_avg - avg^2)) = 0;

--Update the prediction based on the new data
UPDATE dailydrop.Submission_zscore
SET prediction = (avg + trend)::int,
last_updated = now();
--Update num_plays_yesterday since we have processed that data
--Update the prediction based on the new data
--num_plays is incremented when a play is inserted into the db
UPDATE dailydrop.Submission_metrics
SET num_plays_yest = num_plays,
last_updated = now();
COMMIT;
--END TRENDING Z SCORE CALCULATIONS


 OLD_UPDATE_ZSCORE_FIELDS: "UPDATE dailydrop.Submission_zscore as score \
    SET avg = COALESCE( \
        dailydrop.smoothing_alpha() * \
        (SELECT num_plays - num_plays_yest FROM dailydrop.submission_metrics AS m \
        WHERE m.submission_id = score.submission_id) + \
        (1 - dailydrop.smoothing_alpha()) * (avg + trend), \
        (SELECT num_plays FROM dailydrop.submission_metrics AS m WHERE m.submission_id = submission_id)), \
    sqr_avg = COALESCE( \
        sqr_avg * (1 - dailydrop.smoothing_alpha()) + \
        (((SELECT num_plays - num_plays_yest FROM dailydrop.submission_metrics AS m WHERE m.submission_id = score.submission_id))^ 2) * dailydrop.smoothing_alpha(), \
        (SELECT num_plays^2 FROM dailydrop.submission_metrics AS m WHERE m.submission_id = submission_id)), \
    trend = dailydrop.smoothing_beta() * (avg - previous_avg) + (1 - dailydrop.smoothing_beta()) * trend;"
  
;

UPDATE "dailydrop"."submission_zscore" SET "z_score"=NULL WHERE "submission_id"='ed8c6fad-abfe-4b22-b7cf-9c2216fb7906' RETURNING "submission_id", "avg", "sqr_avg", "z_score", "last_updated", "previous_avg", "trend", "prediction";





ALTER TABLE "dailydrop"."submission_zscore" ALTER COLUMN "sqr_avg" TYPE float(4);

ALTER TABLE "dailydrop"."submission_zscore"
  ALTER COLUMN "previous_avg" TYPE double precision USING previous_avg::double precision,
  ALTER COLUMN "trend" TYPE double precision USING previous_avg::double precision;

    
INSERT INTO dailydrop.submission_zscore(submission_id, avg, sqr_avg, previous_avg, z_score) VALUES
        ('2bca6d38-617f-4f9b-905b-f695ab8943c2', 10, 100, 5, 1.5),
        ('0b6a3d91-ae0b-4c2d-b501-548d8c3b23d7', 20, 400, 15, 0.5),
        ('cd6b5fde-cf31-49ce-b4d2-988694ed9157', 30, 900, 40, 5)
ON CONFLICT DO NOTHING;



